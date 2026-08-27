export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface StoredObject {
  key: string;
  body: Uint8Array;
  size: number;
  contentType: string;
  metadata: Record<string, string>;
  lastModified: string;
}

export interface StoredObjectSummary {
  key: string;
  size: number;
  metadata: Record<string, string>;
  lastModified: string;
}

export interface PutObjectInput {
  key: string;
  body: Uint8Array;
  contentType: string;
  metadata: Record<string, string>;
}

export interface PayloadStore {
  put(input: PutObjectInput): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<StoredObjectSummary[]>;
}

export type KeyMaterial = CryptoKey | Uint8Array;

export interface SpillReferenceData {
  version: 1;
  keyVersion: string;
  id: string;
  objectKey: string;
  field: string;
  bytes: number;
  sha256: string;
  preview: string;
  storedAt: string;
  expiresAt: string;
  legalHold: boolean;
  signature: string;
  retrieveUrl?: string;
}

export interface SpillReference {
  $spillway: SpillReferenceData;
}

export interface SpillResult<T extends JsonValue = JsonValue> {
  payload: T;
  spilledCount: number;
  rawBytes: number;
  inlineBytes: number;
  references: SpillReference[];
}

export interface RestoreResult<T extends JsonValue = JsonValue> {
  payload: T;
  restoredCount: number;
}

export interface SpillOptions { legalHold?: boolean; }
export interface RestoreOptions { allowExpired?: boolean; }

export interface SpillwayConfig {
  allowlist: string[];
  maxInlineBytes: number;
  store: PayloadStore;
  encryptionKey: KeyMaterial;
  signingKey: KeyMaterial;
  expiresInMs: number;
  previewBytes?: number;
  publicBaseUrl?: string;
  objectPrefix?: string;
  keyVersion?: string;
  now?: () => Date;
}

export interface RetentionReport {
  generatedAt: string;
  objects: number;
  encryptedBytes: number;
  expiredObjects: number;
  expiredBytes: number;
  heldObjects: number;
  nextExpiry: string | null;
}

export interface ReclaimOptions {
  expiredOnly?: boolean;
  before?: Date;
  dryRun?: boolean;
}

export interface ReclaimResult {
  dryRun: boolean;
  candidates: number;
  reclaimedObjects: number;
  reclaimedBytes: number;
  heldSkipped: number;
}
