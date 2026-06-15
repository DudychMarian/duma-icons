import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, toPascalCase, toCamelCase } from "./naming.js";

test("slugify normalizes spaces, case and extension", () => {
  assert.equal(slugify("Info.svg"), "info");
  assert.equal(slugify("product hunt.svg"), "product-hunt");
  assert.equal(slugify("tik tok.svg"), "tik-tok");
  assert.equal(slugify("arrow-right.svg"), "arrow-right");
  assert.equal(slugify("  Multiple   Spaces  "), "multiple-spaces");
});

test("toPascalCase builds valid identifiers", () => {
  assert.equal(toPascalCase("arrow-right"), "ArrowRight");
  assert.equal(toPascalCase("product-hunt"), "ProductHunt");
  assert.equal(toPascalCase("info"), "Info");
});

test("toPascalCase rewrites leading digits to words", () => {
  assert.equal(toPascalCase("2-tap"), "TwoTap");
  assert.equal(toPascalCase("3-tap"), "ThreeTap");
  assert.equal(toPascalCase("2-scroll-up-1"), "TwoScrollUp1");
  // result must be a legal JS identifier start
  assert.match(toPascalCase("2-tap"), /^[A-Za-z_$]/);
});

test("toCamelCase lowercases the first segment", () => {
  assert.equal(toCamelCase("arrow-right"), "arrowRight");
  assert.equal(toCamelCase("2-tap"), "twoTap");
});

test("reserved words get an Icon suffix in both cases", () => {
  assert.equal(toPascalCase("delete"), "DeleteIcon");
  assert.equal(toPascalCase("switch"), "SwitchIcon");
  assert.equal(toCamelCase("delete"), "deleteIcon");
  assert.equal(toCamelCase("switch"), "switchIcon");
  // multi-word names that merely contain a keyword are untouched
  assert.equal(toPascalCase("delete-file"), "DeleteFile");
});
