import { createHash } from "node:crypto";
import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const release = "RELEASE.2025-09-07T16-13-09Z";
const expectedSha256 = "7c5bd8512c6e966455b1d198209358b2d191c77a83ab377c4073281065fb855f";
const directory = join(tmpdir(), "event-payload-spillway-tools");
const executable = join(directory, `minio.${release}`);

async function digest(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

export async function ensureMinio() {
  await mkdir(directory, { recursive: true });
  try {
    if (await digest(executable) === expectedSha256) return executable;
  } catch { /* download below */ }
  const response = await fetch(`https://dl.min.io/server/minio/release/linux-amd64/archive/minio.${release}`);
  if (!response.ok) throw new Error(`MinIO download failed: ${response.status}`);
  const temporary = `${executable}.${process.pid}.download`;
  await writeFile(temporary, new Uint8Array(await response.arrayBuffer()));
  const actual = await digest(temporary);
  if (actual !== expectedSha256) throw new Error(`MinIO checksum mismatch: ${actual}`);
  await chmod(temporary, 0o755);
  await rename(temporary, executable);
  return executable;
}
