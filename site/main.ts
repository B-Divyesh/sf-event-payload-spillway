import { MemoryStore, Spillway, generateKey, type JsonValue, type SpillResult } from "../src/index.js";
import "./style.css";

const required = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const sample = {
  event: "render.complete",
  job_id: "job_7f31",
  result: {
    mime: "image/png",
    attachment: `data:image/png;base64,${"R0lGODlhAQABAIAAAAUEBA".repeat(360)}`,
  },
};

const form = required<HTMLFormElement>("#spill-form");
const payloadInput = required<HTMLTextAreaElement>("#payload");
const pointerInput = required<HTMLInputElement>("#pointer");
const thresholdInput = required<HTMLInputElement>("#threshold");
const errorOutput = required<HTMLElement>("#payload-error");
const inputSize = required<HTMLElement>("#input-size");
const emptyResult = required<HTMLElement>("#empty-result");
const resultContent = required<HTMLElement>("#result-content");
const decisionLabel = required<HTMLElement>("#decision-label");
const spillButton = required<HTMLButtonElement>("#spill-button");
const restoreButton = required<HTMLButtonElement>("#restore-button");
const resetButton = required<HTMLButtonElement>("#reset-button");
const restoreStatus = required<HTMLElement>("#restore-status");
const resultMessage = required<HTMLElement>("#result-message");
const stubOutput = required<HTMLElement>("#stub-output code");
const offline = required<HTMLElement>("#offline");
let active: { spillway: Spillway; result: SpillResult } | null = null;

const bytes = (count: number): string => count < 1024 ? `${count} B` : `${(count / 1024).toFixed(count < 10240 ? 1 : 0)} KB`;

function updateInputSize(): void {
  inputSize.textContent = bytes(new TextEncoder().encode(payloadInput.value).byteLength);
}

function setError(message: string): void {
  errorOutput.textContent = message;
  payloadInput.setAttribute("aria-invalid", message ? "true" : "false");
}

function resetLedger(): void {
  active = null;
  emptyResult.hidden = false;
  resultContent.hidden = true;
  decisionLabel.textContent = "Waiting";
  restoreStatus.textContent = "";
  setError("");
  payloadInput.focus();
}

async function runSpill(): Promise<void> {
  setError("");
  restoreStatus.textContent = "";
  let payload: JsonValue;
  try { payload = JSON.parse(payloadInput.value) as JsonValue; }
  catch { setError("This is not valid JSON. Fix the highlighted payload and try again."); payloadInput.focus(); return; }
  if (!pointerInput.value.startsWith("/")) { setError("The allowlist entry must be an RFC 6901 pointer beginning with /. "); pointerInput.focus(); return; }
  const threshold = Number(thresholdInput.value);
  if (!Number.isInteger(threshold) || threshold < 128) { setError("Choose a byte limit of at least 128."); thresholdInput.focus(); return; }

  spillButton.disabled = true;
  spillButton.textContent = "Measuring…";
  decisionLabel.textContent = "Working";
  try {
    const spillway = new Spillway({
      allowlist: [pointerInput.value],
      maxInlineBytes: threshold, store: new MemoryStore(),
      encryptionKey: await generateKey(), signingKey: await generateKey(),
      expiresInMs: 7 * 24 * 60 * 60 * 1000,
      publicBaseUrl: "https://hooks.example.net/__spillway",
    } as ConstructorParameters<typeof Spillway>[0]);
    const result = await spillway.spill(payload);
    active = { spillway, result };
    const avoided = Math.max(0, Math.round((1 - result.inlineBytes / result.rawBytes) * 100));
    required("#raw-bytes").textContent = bytes(result.rawBytes);
    required("#inline-bytes").textContent = bytes(result.inlineBytes);
    required("#avoided-percent").textContent = `${avoided}%`;
    required<HTMLElement>("#bar-inline").style.width = `${Math.max(2, Math.min(100, 100 - avoided))}%`;
    emptyResult.hidden = true;
    resultContent.hidden = false;
    if (result.spilledCount) {
      decisionLabel.textContent = "Diverted";
      resultMessage.className = "result-message success";
      resultMessage.textContent = `✓ ${result.spilledCount} oversized field was encrypted and moved out of the database row.`;
      stubOutput.textContent = JSON.stringify(result.payload, null, 2);
      restoreButton.hidden = false;
    } else {
      decisionLabel.textContent = "Inline";
      resultMessage.className = "result-message neutral";
      resultMessage.textContent = "No allowed field crossed the limit. The event stays inline.";
      stubOutput.textContent = JSON.stringify(result.payload, null, 2);
      restoreButton.hidden = true;
    }
    resultContent.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest" });
  } catch (error) {
    active = null;
    setError(error instanceof Error ? error.message : "The spill decision failed. Check the configuration and retry.");
    decisionLabel.textContent = "Error";
  } finally {
    spillButton.disabled = false;
    spillButton.innerHTML = 'Test this payload <span aria-hidden="true">→</span>';
  }
}

payloadInput.value = JSON.stringify(sample, null, 2);
updateInputSize();
payloadInput.addEventListener("input", updateInputSize);
form.addEventListener("submit", (event) => { event.preventDefault(); void runSpill(); });
resetButton.addEventListener("click", resetLedger);
restoreButton.addEventListener("click", async () => {
  if (!active) return;
  restoreButton.disabled = true;
  restoreStatus.textContent = "Decrypting and checking integrity…";
  try {
    const restored = await active.spillway.restore(active.result.payload);
    const location = pointerInput.value.split("/").filter(Boolean).reduce<JsonValue | undefined>((value, key) => value && typeof value === "object" && !Array.isArray(value) ? value[key] : undefined, restored.payload);
    restoreStatus.textContent = `✓ Restored ${restored.restoredCount} field locally; recovered value is ${bytes(new TextEncoder().encode(JSON.stringify(location)).byteLength)}.`;
  } catch (error) {
    restoreStatus.textContent = error instanceof Error ? `Restore failed: ${error.message}` : "Restore failed. Retry the spill.";
  } finally { restoreButton.disabled = false; }
});

document.querySelectorAll<HTMLButtonElement>("[data-copy], [data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = button.dataset.copyTarget ? document.querySelector(`#${button.dataset.copyTarget}`)?.textContent : button.dataset.copy;
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      const label = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = label; }, 1600);
    } catch { button.textContent = "Copy failed"; }
  });
});

const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
tabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(tabIndex + offset + tabs.length) % tabs.length];
    if (next) { selectTab(next); next.focus(); }
  });
});

function selectTab(selected: HTMLButtonElement): void {
  tabs.forEach((tab) => {
    const activeTab = tab === selected;
    tab.setAttribute("aria-selected", String(activeTab));
    tab.tabIndex = activeTab ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
    if (panel) panel.hidden = !activeTab;
  });
}

const updateNetwork = (): void => { offline.hidden = navigator.onLine; };
window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);
updateNetwork();

if ("serviceWorker" in navigator && location.protocol === "https:") void navigator.serviceWorker.register("/service-worker.js");
