import { byteLength, constantTimeEqual, cryptoBytes, fromBase64Url, randomId, sha256, text, toBase64Url, utf8 } from "./bytes.js";
import type {
  JsonValue, KeyMaterial, ReclaimOptions, ReclaimResult, RestoreOptions, RestoreResult,
  RetentionReport, SpillOptions, SpillReference, SpillReferenceData, SpillResult, SpillwayConfig,
} from "./types.js";

interface CipherEnvelope {
  algorithm: "AES-256-GCM";
  iv: string;
  aad: string;
  ciphertext: string;
}

const REF_KEYS: (keyof SpillReferenceData)[] = [
  "version", "keyVersion", "id", "objectKey", "field", "bytes", "sha256",
  "storedAt", "expiresAt", "legalHold",
];

export async function generateKey(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(32));
}

function assertPointer(pointer: string): void {
  if (!pointer.startsWith("/") || pointer.includes("//")) {
    throw new TypeError(`Invalid JSON pointer: ${pointer}`);
  }
}

function pointerParts(pointer: string): string[] {
  return pointer.slice(1).split("/").map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
}

function locate(root: JsonValue, pointer: string): { parent: JsonValue[] | { [key: string]: JsonValue }; key: string } | null {
  const parts = pointerParts(pointer);
  let current: JsonValue = root;
  for (const part of parts.slice(0, -1)) {
    if (current === null || typeof current !== "object") return null;
    const next: JsonValue | undefined = Array.isArray(current) ? current[Number(part)] : current[part];
    if (next === undefined) return null;
    current = next;
  }
  if (current === null || typeof current !== "object") return null;
  const key = parts.at(-1);
  if (key === undefined) return null;
  if (Array.isArray(current)) {
    if (!/^(?:0|[1-9]\d*)$/u.test(key)) return null;
    const index = Number(key);
    return Number.isInteger(index) && index >= 0 && index < current.length ? { parent: current, key } : null;
  }
  return Object.hasOwn(current, key) ? { parent: current, key } : null;
}

function readAt(location: NonNullable<ReturnType<typeof locate>>): JsonValue {
  return Array.isArray(location.parent) ? location.parent[Number(location.key)]! : location.parent[location.key]!;
}

function writeAt(location: NonNullable<ReturnType<typeof locate>>, value: JsonValue): void {
  if (Array.isArray(location.parent)) location.parent[Number(location.key)] = value;
  else location.parent[location.key] = value;
}

function isReference(value: JsonValue): boolean {
  if (value === null || Array.isArray(value) || typeof value !== "object") return false;
  const marker = value.$spillway;
  return marker !== null && !Array.isArray(marker) && typeof marker === "object"
    && marker.version === 1 && typeof marker.signature === "string" && typeof marker.objectKey === "string";
}

function safePreview(value: JsonValue, limit: number): string {
  if (typeof value === "string") {
    const compact = value.replace(/\s+/gu, " ").trim();
    const looksSensitive = /^(?:data:|eyJ|sk[_-]|gh[oprs]_|xox[baprs]-)/iu.test(compact);
    const looksBase64 = compact.length > 80 && /^[A-Za-z0-9+/=_-]+$/u.test(compact);
    if (looksSensitive || looksBase64) return `[redacted encoded string · ${byteLength(value).toLocaleString("en-US")} bytes]`;
    return compact.length > limit ? `${compact.slice(0, limit)}…` : compact;
  }
  if (Array.isArray(value)) return `[array · ${value.length.toLocaleString("en-US")} items]`;
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value);
    return `{object · ${keys.length.toLocaleString("en-US")} keys: ${keys.slice(0, 4).join(", ")}${keys.length > 4 ? ", …" : ""}}`;
  }
  return JSON.stringify(value);
}

async function aesKey(material: KeyMaterial): Promise<CryptoKey> {
  if (material instanceof CryptoKey) return material;
  if (material.byteLength !== 32) throw new TypeError("encryptionKey must be 32 bytes for AES-256-GCM");
  return crypto.subtle.importKey("raw", cryptoBytes(material), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function hmacKey(material: KeyMaterial): Promise<CryptoKey> {
  if (material instanceof CryptoKey) return material;
  if (material.byteLength < 32) throw new TypeError("signingKey must be at least 32 bytes");
  return crypto.subtle.importKey("raw", cryptoBytes(material), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function canonicalReference(reference: SpillReferenceData): string {
  return REF_KEYS.map((key) => `${key}=${String(reference[key])}`).join("\n");
}

export class Spillway {
  readonly #config: Required<Pick<SpillwayConfig, "previewBytes" | "objectPrefix" | "keyVersion" | "now">> & SpillwayConfig;

  constructor(config: SpillwayConfig) {
    if (!Number.isFinite(config.maxInlineBytes) || config.maxInlineBytes < 1) throw new TypeError("maxInlineBytes must be positive");
    if (!Number.isFinite(config.expiresInMs) || config.expiresInMs < 1) throw new TypeError("expiresInMs must be positive");
    if (config.allowlist.length === 0) throw new TypeError("allowlist must contain at least one JSON pointer");
    config.allowlist.forEach(assertPointer);
    if (new Set(config.allowlist).size !== config.allowlist.length) throw new TypeError("allowlist contains duplicate pointers");
    this.#config = { previewBytes: 72, objectPrefix: "spillway/", keyVersion: "v1", now: () => new Date(), ...config };
  }

  async spill<T extends JsonValue>(payload: T, options: SpillOptions = {}): Promise<SpillResult<T>> {
    const serialized = JSON.stringify(payload);
    if (serialized === undefined) throw new TypeError("payload must be JSON serializable");
    const rawBytes = utf8(serialized).byteLength;
    const output = JSON.parse(serialized) as T;
    const references: SpillReference[] = [];
    const written: string[] = [];
    try {
      for (const field of this.#config.allowlist) {
        const location = locate(output, field);
        if (!location) continue;
        const value = readAt(location);
        const plaintext = utf8(JSON.stringify(value));
        if (plaintext.byteLength <= this.#config.maxInlineBytes || isReference(value)) continue;

        const id = randomId();
        const storedAt = this.#config.now().toISOString();
        const expiresAt = new Date(new Date(storedAt).getTime() + this.#config.expiresInMs).toISOString();
        const objectKey = `${this.#config.objectPrefix}${storedAt.slice(0, 10)}/${id}.json.enc`;
        const digest = await sha256(plaintext);
        const reference: SpillReferenceData = {
          version: 1,
          keyVersion: this.#config.keyVersion,
          id,
          objectKey,
          field,
          bytes: plaintext.byteLength,
          sha256: digest,
          preview: safePreview(value, this.#config.previewBytes),
          storedAt,
          expiresAt,
          legalHold: options.legalHold ?? false,
          signature: "",
        };
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const aad = utf8(`${id}|${field}|${this.#config.keyVersion}`);
        const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: cryptoBytes(iv), additionalData: cryptoBytes(aad) }, await aesKey(this.#config.encryptionKey), cryptoBytes(plaintext));
        const envelope: CipherEnvelope = { algorithm: "AES-256-GCM", iv: toBase64Url(iv), aad: text(aad), ciphertext: toBase64Url(new Uint8Array(ciphertext)) };
        const encryptedBody = utf8(JSON.stringify(envelope));
        reference.signature = await this.#sign(reference);
        if (this.#config.publicBaseUrl) {
          const base = this.#config.publicBaseUrl.replace(/\/$/u, "");
          reference.retrieveUrl = `${base}?ref=${encodeURIComponent(toBase64Url(utf8(JSON.stringify(reference))))}`;
        }
        await this.#config.store.put({
          key: objectKey,
          body: encryptedBody,
          contentType: "application/vnd.spillway.encrypted+json",
          metadata: {
            "spillway-id": id,
            "spillway-field": field,
            "spillway-expires-at": expiresAt,
            "spillway-legal-hold": String(reference.legalHold),
            "spillway-raw-bytes": String(reference.bytes),
            "spillway-sha256": digest,
          },
        });
        written.push(objectKey);
        const wrapped = { $spillway: reference } satisfies SpillReference;
        writeAt(location, wrapped as unknown as JsonValue);
        references.push(wrapped);
      }
    } catch (error) {
      await Promise.allSettled(written.map((key) => this.#config.store.delete(key)));
      throw error;
    }
    return { payload: output, spilledCount: references.length, rawBytes, inlineBytes: byteLength(output), references };
  }

  async restore<T extends JsonValue>(payload: T, options: RestoreOptions = {}): Promise<RestoreResult<T>> {
    const output = JSON.parse(JSON.stringify(payload)) as T;
    let restoredCount = 0;
    for (const field of this.#config.allowlist) {
      const location = locate(output, field);
      if (!location) continue;
      const wrapped = readAt(location);
      if (!isReference(wrapped)) continue;
      const reference = (wrapped as unknown as SpillReference).$spillway;
      if (reference.field !== field) throw new Error(`Invalid spill reference at ${field}`);
      writeAt(location, await this.retrieve(reference, options));
      restoredCount += 1;
    }
    return { payload: output, restoredCount };
  }

  async retrieve(referenceInput: SpillReference | SpillReferenceData, options: RestoreOptions = {}): Promise<JsonValue> {
    const reference = "$spillway" in referenceInput ? referenceInput.$spillway : referenceInput;
    if (!(await this.verifyReference(reference))) throw new Error(`Invalid spill reference: ${reference.id}`);
    if (!options.allowExpired && new Date(reference.expiresAt).getTime() <= this.#config.now().getTime()) {
      throw new Error(`Spill reference expired at ${reference.expiresAt}`);
    }
    const stored = await this.#config.store.get(reference.objectKey);
    if (!stored) throw new Error(`Spilled object is missing: ${reference.id}`);
    const envelope = JSON.parse(text(stored.body)) as CipherEnvelope;
    if (envelope.algorithm !== "AES-256-GCM" || envelope.aad !== `${reference.id}|${reference.field}|${reference.keyVersion}`) {
      throw new Error(`Encrypted object metadata does not match reference: ${reference.id}`);
    }
    let plaintext: ArrayBuffer;
    try {
      plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: cryptoBytes(fromBase64Url(envelope.iv)), additionalData: cryptoBytes(utf8(envelope.aad)) },
        await aesKey(this.#config.encryptionKey), cryptoBytes(fromBase64Url(envelope.ciphertext)),
      );
    } catch {
      throw new Error(`Unable to decrypt spilled object: ${reference.id}`);
    }
    const bytes = new Uint8Array(plaintext);
    if (!constantTimeEqual(await sha256(bytes), reference.sha256)) throw new Error(`Spilled object failed integrity check: ${reference.id}`);
    return JSON.parse(text(bytes)) as JsonValue;
  }

  async verifyReference(reference: SpillReferenceData): Promise<boolean> {
    if (reference.version !== 1 || !reference.signature || !reference.objectKey.startsWith(this.#config.objectPrefix)) return false;
    const expected = await this.#sign(reference);
    return constantTimeEqual(reference.signature, expected);
  }

  async retentionReport(): Promise<RetentionReport> {
    const now = this.#config.now();
    const items = await this.#config.store.list(this.#config.objectPrefix);
    let expiredObjects = 0;
    let expiredBytes = 0;
    let heldObjects = 0;
    let nextExpiry: string | null = null;
    for (const item of items) {
      const expiresAt = item.metadata["spillway-expires-at"];
      const held = item.metadata["spillway-legal-hold"] === "true";
      if (held) heldObjects += 1;
      if (expiresAt && new Date(expiresAt) <= now) { expiredObjects += 1; expiredBytes += item.size; }
      else if (expiresAt && (!nextExpiry || expiresAt < nextExpiry)) nextExpiry = expiresAt;
    }
    return {
      generatedAt: now.toISOString(), objects: items.length,
      encryptedBytes: items.reduce((total, item) => total + item.size, 0),
      expiredObjects, expiredBytes, heldObjects, nextExpiry,
    };
  }

  async reclaim(options: ReclaimOptions = {}): Promise<ReclaimResult> {
    const expiredOnly = options.expiredOnly ?? true;
    const before = options.before ?? this.#config.now();
    if (!expiredOnly && !options.before) throw new TypeError("Set before when expiredOnly is false to bound reclamation");
    const items = await this.#config.store.list(this.#config.objectPrefix);
    let heldSkipped = 0;
    const candidates = items.filter((item) => {
      if (item.metadata["spillway-legal-hold"] === "true") { heldSkipped += 1; return false; }
      const expiresAt = item.metadata["spillway-expires-at"];
      const comparison = expiredOnly ? expiresAt : item.lastModified;
      return Boolean(comparison && new Date(comparison!) <= before);
    });
    if (!options.dryRun) await Promise.all(candidates.map((item) => this.#config.store.delete(item.key)));
    return {
      dryRun: options.dryRun ?? false,
      candidates: candidates.length,
      reclaimedObjects: options.dryRun ? 0 : candidates.length,
      reclaimedBytes: options.dryRun ? 0 : candidates.reduce((total, item) => total + item.size, 0),
      heldSkipped,
    };
  }

  async #sign(reference: SpillReferenceData): Promise<string> {
    const signature = await crypto.subtle.sign("HMAC", await hmacKey(this.#config.signingKey), cryptoBytes(utf8(canonicalReference(reference))));
    return toBase64Url(new Uint8Array(signature));
  }
}
