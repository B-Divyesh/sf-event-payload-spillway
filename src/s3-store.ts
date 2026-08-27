import { cryptoBytes, hex, utf8 } from "./bytes.js";
import type { PayloadStore, PutObjectInput, StoredObject, StoredObjectSummary } from "./types.js";

export interface S3CompatibleStoreConfig {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  forcePathStyle?: boolean;
  fetch?: typeof globalThis.fetch;
}

const rfc3986 = (value: string): string => encodeURIComponent(value).replace(/[!'()*]/gu, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
const encodePath = (value: string): string => value.split("/").map(rfc3986).join("/");
const xmlText = (value: string): string => value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'");

async function digest(value: Uint8Array): Promise<string> {
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", cryptoBytes(value))));
}

async function hmac(key: Uint8Array, value: string): Promise<Uint8Array> {
  const imported = await crypto.subtle.importKey("raw", cryptoBytes(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", imported, cryptoBytes(utf8(value))));
}

export class S3CompatibleStore implements PayloadStore {
  readonly #config: S3CompatibleStoreConfig;
  readonly #fetch: typeof globalThis.fetch;

  constructor(config: S3CompatibleStoreConfig) {
    const endpoint = new URL(config.endpoint);
    if (!endpoint.hostname || endpoint.search || endpoint.hash) throw new TypeError("endpoint must be an absolute URL without query or fragment");
    if (!config.bucket || !config.region || !config.accessKeyId || !config.secretAccessKey) throw new TypeError("S3 bucket, region, and credentials are required");
    this.#config = { forcePathStyle: true, ...config, endpoint: endpoint.toString().replace(/\/$/u, "") };
    this.#fetch = config.fetch ?? globalThis.fetch;
  }

  async put(input: PutObjectInput): Promise<void> {
    const metadata = Object.fromEntries(Object.entries(input.metadata).map(([key, value]) => [`x-amz-meta-${key.toLowerCase()}`, value]));
    const response = await this.#request("PUT", input.key, {}, input.body, { "content-type": input.contentType, ...metadata });
    if (!response.ok) throw await this.#error("put", response);
  }

  async get(key: string): Promise<StoredObject | null> {
    const response = await this.#request("GET", key);
    if (response.status === 404) return null;
    if (!response.ok) throw await this.#error("get", response);
    const body = new Uint8Array(await response.arrayBuffer());
    return {
      key,
      body,
      size: body.byteLength,
      contentType: response.headers.get("content-type") ?? "application/octet-stream",
      metadata: this.#metadata(response.headers),
      lastModified: response.headers.get("last-modified") ?? new Date(0).toISOString(),
    };
  }

  async delete(key: string): Promise<void> {
    const response = await this.#request("DELETE", key);
    if (!response.ok && response.status !== 404) throw await this.#error("delete", response);
  }

  async list(prefix = ""): Promise<StoredObjectSummary[]> {
    const results: StoredObjectSummary[] = [];
    let continuation: string | undefined;
    do {
      const query: Record<string, string> = { "list-type": "2", prefix };
      if (continuation) query["continuation-token"] = continuation;
      const response = await this.#request("GET", undefined, query);
      if (!response.ok) throw await this.#error("list", response);
      const xml = await response.text();
      const contents = [...xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/gu)];
      for (const match of contents) {
        const block = match[1] ?? "";
        const key = xmlText(block.match(/<Key>([\s\S]*?)<\/Key>/u)?.[1] ?? "");
        const head = await this.#request("HEAD", key);
        if (!head.ok) throw await this.#error("head", head);
        results.push({
          key,
          size: Number(block.match(/<Size>(\d+)<\/Size>/u)?.[1] ?? head.headers.get("content-length") ?? 0),
          lastModified: block.match(/<LastModified>(.*?)<\/LastModified>/u)?.[1] ?? head.headers.get("last-modified") ?? new Date(0).toISOString(),
          metadata: this.#metadata(head.headers),
        });
      }
      const truncated = xml.match(/<IsTruncated>(true|false)<\/IsTruncated>/u)?.[1] === "true";
      continuation = truncated ? xmlText(xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/u)?.[1] ?? "") : undefined;
    } while (continuation);
    return results;
  }

  #metadata(headers: Headers): Record<string, string> {
    const metadata: Record<string, string> = {};
    headers.forEach((value, key) => {
      if (key.startsWith("x-amz-meta-")) metadata[key.slice(11)] = value;
    });
    return metadata;
  }

  #url(key?: string, query: Record<string, string> = {}): URL {
    const endpoint = new URL(this.#config.endpoint);
    const basePath = endpoint.pathname.replace(/\/$/u, "");
    if (this.#config.forcePathStyle) endpoint.pathname = `${basePath}/${encodePath(this.#config.bucket)}${key ? `/${encodePath(key)}` : ""}`;
    else {
      endpoint.hostname = `${this.#config.bucket}.${endpoint.hostname}`;
      endpoint.pathname = `${basePath}${key ? `/${encodePath(key)}` : "/"}`;
    }
    const search = Object.entries(query).sort(([left], [right]) => left.localeCompare(right)).map(([name, value]) => `${rfc3986(name)}=${rfc3986(value)}`).join("&");
    endpoint.search = search;
    return endpoint;
  }

  async #request(method: string, key?: string, query: Record<string, string> = {}, body: Uint8Array = new Uint8Array(), extraHeaders: Record<string, string> = {}): Promise<Response> {
    const url = this.#url(key, query);
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/gu, "");
    const date = amzDate.slice(0, 8);
    const bodyHash = await digest(body);
    const headers: Record<string, string> = {
      host: url.host,
      "x-amz-content-sha256": bodyHash,
      "x-amz-date": amzDate,
      ...Object.fromEntries(Object.entries(extraHeaders).map(([name, value]) => [name.toLowerCase(), value.trim()])),
    };
    if (this.#config.sessionToken) headers["x-amz-security-token"] = this.#config.sessionToken;
    const names = Object.keys(headers).sort();
    const canonicalHeaders = names.map((name) => `${name}:${headers[name]!.replace(/\s+/gu, " ")}\n`).join("");
    const canonicalRequest = [method, url.pathname, url.search.slice(1), canonicalHeaders, names.join(";"), bodyHash].join("\n");
    const scope = `${date}/${this.#config.region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${await digest(utf8(canonicalRequest))}`;
    const kDate = await hmac(utf8(`AWS4${this.#config.secretAccessKey}`), date);
    const kRegion = await hmac(kDate, this.#config.region);
    const kService = await hmac(kRegion, "s3");
    const kSigning = await hmac(kService, "aws4_request");
    const signature = hex(await hmac(kSigning, stringToSign));
    headers.authorization = `AWS4-HMAC-SHA256 Credential=${this.#config.accessKeyId}/${scope}, SignedHeaders=${names.join(";")}, Signature=${signature}`;
    delete headers.host;
    const init: RequestInit = { method, headers };
    if (method === "PUT") init.body = cryptoBytes(body);
    return this.#fetch(url, init);
  }

  async #error(action: string, response: Response): Promise<Error> {
    const detail = (await response.text()).replace(/<[^>]+>/gu, " ").replace(/\s+/gu, " ").trim().slice(0, 240);
    return new Error(`S3 ${action} failed (${response.status})${detail ? `: ${detail}` : ""}`);
  }
}
