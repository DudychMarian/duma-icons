import { test } from "node:test";
import assert from "node:assert/strict";
import { dimensions, toSvg } from "./to-svg.js";
import type { IconData } from "./types.js";

const wide: IconData = { name: "Wide", viewBox: "0 0 151 84", body: '<path d="M0 0z"/>' };
const tall: IconData = { name: "Tall", viewBox: "0 0 112 170", body: '<path d="M0 0z"/>' };

test("dimensions scale the longest side and preserve ratio", () => {
  assert.deepEqual(dimensions(wide.viewBox, 64), { width: 64, height: 36 });
  assert.deepEqual(dimensions(tall.viewBox, 64), { width: 42, height: 64 });
});

test("toSvg emits a standalone svg with color + viewBox", () => {
  const svg = toSvg(wide, { size: 48, color: "#0a0a0a" });
  assert.match(svg, /<svg[^>]*viewBox="0 0 151 84"/);
  assert.match(svg, /color="#0a0a0a"/);
  assert.match(svg, /width="48"/);
  assert.match(svg, /height="27"/); // round(48*84/151)
  assert.match(svg, /<\/svg>$/);
});

test("toSvg defaults to currentColor at size 24", () => {
  const svg = toSvg(tall);
  assert.match(svg, /color="currentColor"/);
  assert.match(svg, /height="24"/);
});
