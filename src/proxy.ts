import { sha256 } from "./bytes.js";
import type { JsonValue } from "./types.js";
import { Spillway } from "./spillway.js";

export interface VerifyWebhookInput { rawBody: Uint8Array; headers: Headers; request: Request; }
export interface SpillwayProxyOptions {
  spillway: Spillway;
  upstream: string | URL;
  verifyWebhook: (input: VerifyWebhookInput) => boolean | Promise<boolean>;
  fetch?: typeof globalThis.fetch;
  maxRequestBytes?: number;
}

function problem(status: number, title: string, detail: string): Response {
  return Response.json({ type: "about:blank", title, status, detail }, { status, headers: { "content-type": "application/problem+json" } });
}

export function createSpillwayProxy(options: SpillwayProxyOptions): (request: Request) => Promise<Response> {
  const fetcher = options.fetch ?? globalThis.fetch;
  const maxRequestBytes = options.maxRequestBytes ?? 25 * 1024 * 1024;
  return async (request: Request): Promise<Response> => {
    if (request.method === "GET" || request.method === "HEAD") return problem(405, "Method not allowed", "Send a JSON webhook with POST, PUT, or PATCH.");
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > maxRequestBytes) return problem(413, "Payload too large", `The request exceeds the ${maxRequestBytes}-byte proxy limit.`);
    const rawBody = new Uint8Array(await request.arrayBuffer());
    if (rawBody.byteLength > maxRequestBytes) return problem(413, "Payload too large", `The request exceeds the ${maxRequestBytes}-byte proxy limit.`);
    let verified = false;
    try { verified = await options.verifyWebhook({ rawBody, headers: request.headers, request }); }
    catch { return problem(401, "Signature verification failed", "The verifier could not authenticate the untouched request body."); }
    if (!verified) return problem(401, "Invalid webhook signature", "The request was not forwarded.");
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("application/json")) return problem(415, "JSON required", "Set Content-Type to application/json.");
    let payload: JsonValue;
    try { payload = JSON.parse(new TextDecoder().decode(rawBody)) as JsonValue; }
    catch { return problem(400, "Malformed JSON", "Fix the request body and retry."); }
    let result;
    try { result = await options.spillway.spill(payload); }
    catch { return problem(502, "Spill storage failed", "Nothing was forwarded. Check object storage and retry the original event."); }
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    headers.set("content-type", "application/json; charset=utf-8");
    headers.set("x-spillway-count", String(result.spilledCount));
    headers.set("x-spillway-original-sha256", await sha256(rawBody));
    try {
      return await fetcher(options.upstream, { method: request.method, headers, body: JSON.stringify(result.payload), redirect: "manual" });
    } catch {
      return problem(502, "Upstream unavailable", "The spill succeeded, but the upstream could not be reached. Retry using your event system's delivery policy.");
    }
  };
}
