import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Icon } from "./Icon.js";

const VB = "0 0 151 84"; // wide, non-square

test("renders an svg with the preserved viewBox", () => {
  const html = renderToStaticMarkup(
    createElement(Icon, { viewBox: VB, body: '<path d="M0 0h10v10z"/>' }),
  );
  assert.match(html, /<svg/);
  assert.match(html, /viewBox="0 0 151 84"/);
});

test("non-square icon keeps aspect ratio (151x84 -> 24x13 at size 24)", () => {
  const html = renderToStaticMarkup(
    createElement(Icon, { viewBox: VB, body: "<path/>", size: 24 }),
  );
  assert.match(html, /width="24"/);
  assert.match(html, /height="13"/); // round(24*84/151)
});

test("color prop drives currentColor", () => {
  const html = renderToStaticMarkup(
    createElement(Icon, { viewBox: "0 0 24 24", body: "<path/>", color: "#0a0a0a" }),
  );
  assert.match(html, /color="#0a0a0a"/);
});

test("title adds role=img and a <title> element", () => {
  const html = renderToStaticMarkup(
    createElement(Icon, { viewBox: "0 0 24 24", body: "<path/>", title: "Arrow" }),
  );
  assert.match(html, /role="img"/);
  assert.match(html, /<title>Arrow<\/title>/);
});

test("without title the svg is aria-hidden", () => {
  const html = renderToStaticMarkup(
    createElement(Icon, { viewBox: "0 0 24 24", body: "<path/>" }),
  );
  assert.match(html, /aria-hidden="true"/);
});
