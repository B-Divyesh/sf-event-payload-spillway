import type { PayloadStore, PutObjectInput, StoredObject, StoredObjectSummary } from "./types.js";

export class MemoryStore implements PayloadStore {
  readonly #objects = new Map<string, StoredObject>();

  async put(input: PutObjectInput): Promise<void> {
    const now = new Date().toISOString();
    this.#objects.set(input.key, {
      key: input.key,
      body: input.body.slice(),
      size: input.body.byteLength,
      contentType: input.contentType,
      metadata: { ...input.metadata },
      lastModified: now,
    });
  }

  async get(key: string): Promise<StoredObject | null> {
    const item = this.#objects.get(key);
    return item ? { ...item, body: item.body.slice(), metadata: { ...item.metadata } } : null;
  }

  async delete(key: string): Promise<void> { this.#objects.delete(key); }

  async list(prefix = ""): Promise<StoredObjectSummary[]> {
    return [...this.#objects.values()]
      .filter((item) => item.key.startsWith(prefix))
      .map(({ key, size, metadata, lastModified }) => ({ key, size, metadata: { ...metadata }, lastModified }))
      .sort((left, right) => left.key.localeCompare(right.key));
  }
}
