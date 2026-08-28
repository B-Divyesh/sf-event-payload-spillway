import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const claims = JSON.parse(readFileSync(new URL("../.factory/claims.json", import.meta.url), "utf8"));
const seen = new Set();
for (const claim of claims) {
  if (seen.has(claim.id)) throw new Error(`Duplicate claim id: ${claim.id}`);
  seen.add(claim.id);
  const occurrences = spawnSync("rg", ["-l", `@claim:${claim.id}`, "test"], { encoding: "utf8" });
  const files = occurrences.stdout.trim().split("\n").filter(Boolean);
  if (files.length !== 1) throw new Error(`@claim:${claim.id} must occur in exactly one test file; found ${files.length}`);
  process.stdout.write(`\n[claim ${claim.id}] ${claim.claim}\n`);
  const result = spawnSync(claim.test, { cwd: process.cwd(), shell: true, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
process.stdout.write(`\nVerified ${claims.length} declared claims.\n`);
