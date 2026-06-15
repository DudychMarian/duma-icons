import { test } from "node:test";
import assert from "node:assert/strict";
import { optimizeSvg } from "./optimize.js";

const NON_SQUARE = `<svg width="151" height="84" viewBox="0 0 151 84" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10z" fill="black"/></svg>`;

const WITH_CLIP = `<svg width="88" height="153" viewBox="0 0 88 153" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M1 1h2v2z" fill="black"/></g><defs><clipPath id="clip0"><rect width="88" height="153" fill="white"/></clipPath></defs></svg>`;

test("preserves the source viewBox and drops width/height", () => {
  const { viewBox, body } = optimizeSvg(NON_SQUARE, "arrow-right");
  assert.equal(viewBox, "0 0 151 84");
  assert.doesNotMatch(body, /width=/);
  assert.doesNotMatch(body, /height=/);
});

test("remaps black fill to currentColor", () => {
  const { body } = optimizeSvg(NON_SQUARE, "arrow-right");
  assert.match(body, /currentColor/);
  assert.doesNotMatch(body, /fill="black"/);
});

test("namespaces clipPath ids with the slug (no bare clip0)", () => {
  const { body } = optimizeSvg(WITH_CLIP, "finance-dollar");
  assert.match(body, /id="duma-finance-dollar/);
  assert.match(body, /url\(#duma-finance-dollar/);
  assert.doesNotMatch(body, /url\(#clip0\)/);
});

test("two icons get non-colliding ids", () => {
  const a = optimizeSvg(WITH_CLIP, "alpha").body;
  const b = optimizeSvg(WITH_CLIP, "beta").body;
  const idA = /id="([^"]+)"/.exec(a)?.[1];
  const idB = /id="([^"]+)"/.exec(b)?.[1];
  assert.ok(idA && idB && idA !== idB, `${idA} vs ${idB}`);
});

test("no visible white knockout flagged when white is only the clip rect", () => {
  const { hasVisibleWhite } = optimizeSvg(WITH_CLIP, "finance-dollar");
  assert.equal(hasVisibleWhite, false);
});
