const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const utf8 = (value: string): Uint8Array => encoder.encode(value);
export const text = (value: Uint8Array): string => decoder.decode(cryptoBytes(value));
export const byteLength = (value: unknown): number => utf8(JSON.stringify(value)).byteLength;
export const cryptoBytes = (value: Uint8Array): Uint8Array<ArrayBuffer> => new Uint8Array(value);

export function toBase64Url(value: Uint8Array): string {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export async function sha256(value: Uint8Array): Promise<string> {
  return toBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", cryptoBytes(value))));
}

export function randomId(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(18)));
}

export function constantTimeEqual(left: string, right: string): boolean {
  const a = utf8(left);
  const b = utf8(right);
  let difference = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    difference |= (a[index % a.length] ?? 0) ^ (b[index % b.length] ?? 0);
  }
  return difference === 0;
}

export const hex = (value: Uint8Array): string => [...value].map((byte) => byte.toString(16).padStart(2, "0")).join("");
