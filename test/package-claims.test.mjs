import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

function packedConsumer() {
  const directory = mkdtempSync(join(tmpdir(), "spillway-consumer-"));
  const packOutput = JSON.parse(execFileSync("npm", ["pack", "--json", "--pack-destination", directory], { encoding: "utf8" }));
  const tarball = join(directory, packOutput[0].filename);
  writeFileSync(join(directory, "package.json"), JSON.stringify({ private: true, type: "module" }));
  execFileSync("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball], { cwd: directory, stdio: "pipe" });
  return { directory, tarball };
}

const example = `
import { Spillway, MemoryStore, generateKey } from "event-payload-spillway";
const spillway = new Spillway({
  allowlist: ["/result/attachment"], maxInlineBytes: 32000,
  store: new MemoryStore(), encryptionKey: await generateKey(), signingKey: await generateKey(),
  expiresInMs: 7 * 24 * 60 * 60 * 1000, publicBaseUrl: "https://hooks.example.com/__spillway",
});
const input = { event: "render.complete", result: { attachment: "A".repeat(80000) } };
const output = await spillway.spill(input);
const restored = await spillway.restore(output.payload);
if (restored.restoredCount !== 1 || restored.payload.result.attachment !== input.result.attachment) process.exit(1);
`;

test("@claim:package-formats a source checkout builds an installable tarball with ESM, CommonJS, declarations, and zero runtime dependencies", () => {
  const { directory } = packedConsumer();
  try {
    const readme = readFileSync("README.md", "utf8");
    const home = readFileSync("dist/site/index.html", "utf8");
    assert.match(readme, /not yet published to the npm registry/u);
    assert.match(home, /Not yet published to npm/u);
    assert.doesNotMatch(`${readme}${home}`, /npm install event-payload-spillway(?:\s|<)/u);
    writeFileSync(join(directory, "example.mjs"), example);
    execFileSync(process.execPath, ["example.mjs"], { cwd: directory, stdio: "pipe" });
    writeFileSync(join(directory, "commonjs.cjs"), 'const api = require("event-payload-spillway"); if (typeof api.Spillway !== "function") process.exit(1);\n');
    execFileSync(process.execPath, ["commonjs.cjs"], { cwd: directory, stdio: "pipe" });
    writeFileSync(join(directory, "example.ts"), 'import { Spillway, type SpillwayConfig } from "event-payload-spillway"; const value: typeof Spillway | null = Spillway; const config: SpillwayConfig | null = null; void value; void config;\n');
    writeFileSync(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { module: "NodeNext", moduleResolution: "NodeNext", target: "ES2022", strict: true, noEmit: true }, include: ["example.ts"] }));
    execFileSync(process.execPath, [join(process.cwd(), "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"], { cwd: directory, stdio: "pipe" });
    const manifest = JSON.parse(readFileSync(join(directory, "node_modules/event-payload-spillway/package.json"), "utf8"));
    assert.deepEqual(manifest.dependencies ?? {}, {});
    assert.ok(existsSync(join(directory, "node_modules/event-payload-spillway/dist/package/types/index.d.ts")));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("@claim:registry-availability version 0.1.0 is not published to the npm registry", { timeout: 30_000 }, () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8"));
  const packageVersion = `${manifest.name}@${manifest.version}`;
  const result = spawnSync("npm", ["view", packageVersion, "version", "--json"], { encoding: "utf8", timeout: 25_000 });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  assert.equal(result.status, 1, `${packageVersion} unexpectedly resolved from npm:\n${output}`);
  assert.match(output, /E404/u, `npm must report ${packageVersion} as not found:\n${output}`);
  assert.match(readFileSync("README.md", "utf8"), /Version 0\.1\.0 is not yet published to the npm registry\./u);
  assert.match(readFileSync("dist/site/index.html", "utf8"), /Not yet published to npm\./u);
});

test("@claim:required-config landing copy names every required SpillwayConfig property", () => {
  const declarations = readFileSync("dist/package/types/types.d.ts", "utf8");
  const config = declarations.match(/export interface SpillwayConfig \{(?<body>[\s\S]*?)\n\}/u)?.groups?.body;
  assert.ok(config, "SpillwayConfig must be present in the public declarations");
  const required = [...config.matchAll(/^\s+(?<name>[A-Za-z][A-Za-z0-9]*)(?<optional>\?)?:/gmu)]
    .filter((match) => !match.groups?.optional)
    .map((match) => match.groups?.name);
  assert.deepEqual(required, ["allowlist", "maxInlineBytes", "store", "encryptionKey", "signingKey", "expiresInMs"]);
  const home = readFileSync("dist/site/index.html", "utf8");
  assert.match(home, /Choose allowed fields, an inline limit, storage, encryption and signing keys, and a retention window\./u);
  assert.doesNotMatch(home, /Configure four required options/u);
});

test("@claim:node20-runtime the packed README example runs on Node 20", { timeout: 120_000 }, () => {
  const { directory } = packedConsumer();
  try {
    writeFileSync(join(directory, "example.mjs"), `if (Number(process.versions.node.split('.')[0]) !== 20) process.exit(2);${example}`);
    execFileSync("npx", ["-y", "node@20", "example.mjs"], { cwd: directory, stdio: "pipe", timeout: 120_000 });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("@claim:build-artifacts build emits ESM, CommonJS, declarations, and the static site", () => {
  for (const path of ["dist/package/esm/index.js", "dist/package/cjs/index.js", "dist/package/types/index.d.ts", "dist/site/index.html", "dist/site/demo/index.html", "dist/site/404.html"]) assert.equal(existsSync(path), true, path);
});

test("@claim:license-price the package is MIT licensed and the demo has no paid gate", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8"));
  const license = readFileSync("LICENSE", "utf8");
  const home = readFileSync("dist/site/index.html", "utf8");
  const demo = readFileSync("dist/site/demo/index.html", "utf8");
  assert.equal(manifest.license, "MIT");
  assert.match(license, /Permission is hereby granted, free of charge/u);
  assert.match(home, /Free and MIT licensed/u);
  assert.doesNotMatch(`${home}${demo}`, /checkout|payment|subscribe|billing/u);
});
