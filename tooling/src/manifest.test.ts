import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildManifest } from "./manifest.js";

const SVG = `<svg viewBox="0 0 10 10"><path d="M0 0h10v10z" fill="black"/></svg>`;

function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "duma-"));
  // alpha sorts before beta; both contain camera.svg -> collision
  for (const cat of ["alpha", "beta"]) {
    mkdirSync(join(root, cat), { recursive: true });
    writeFileSync(join(root, cat, "camera.svg"), SVG);
  }
  writeFileSync(join(root, "beta", "2-tap.svg"), SVG); // leading-digit name
  return root;
}

test("resolves cross-category collisions and keeps an alias", () => {
  const { icons, renamed } = buildManifest(fixture());

  const cameras = icons.filter((i) => i.originalSlug === "camera");
  assert.equal(cameras.length, 2);

  const canonical = icons.find((i) => i.slug === "camera");
  const prefixed = icons.find((i) => i.slug === "beta-camera");
  assert.ok(canonical, "alpha keeps the plain slug");
  assert.equal(canonical!.category, "alpha");
  assert.ok(prefixed, "beta is category-prefixed");
  assert.deepEqual(prefixed!.aliases, ["camera"]);

  assert.equal(renamed.length, 1);
  assert.equal(renamed[0]!.to, "beta-camera");
});

test("leading-digit filename becomes a valid component name", () => {
  const { icons } = buildManifest(fixture());
  const tap = icons.find((i) => i.originalSlug === "2-tap");
  assert.ok(tap);
  assert.equal(tap!.name, "TwoTap");
  assert.match(tap!.name, /^[A-Za-z_$]/);
});

test("all component names are unique", () => {
  const { icons } = buildManifest(fixture());
  const names = icons.map((i) => i.name);
  assert.equal(new Set(names).size, names.length);
});
