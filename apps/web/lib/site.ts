import { metadata as icons } from "duma-icons/metadata";

// Production URL, in priority order:
//   1. NEXT_PUBLIC_SITE_URL — set this in Vercel for a custom domain.
//   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's auto domain (no protocol), used as a fallback.
//   3. localhost — for local dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "Duma Icons";

export const ICON_COUNT = icons.length;
export const CATEGORY_COUNT = new Set(icons.map((i) => i.category)).size;

export const TITLE = `${SITE_NAME} — ${ICON_COUNT}+ free hand-drawn SVG & React icons`;

export const DESCRIPTION = `Browse ${ICON_COUNT} hand-drawn, open-source icons across ${CATEGORY_COUNT} categories. Recolor, resize, copy the SVG or download — free for React and any framework.`;

export const KEYWORDS = [
  "hand-drawn icons",
  "svg icons",
  "react icons",
  "free icons",
  "open source icons",
  "icon library",
  "icon set",
  "icon pack",
  "duma icons",
  "customizable icons",
];
