/**
 * Naming rules for Duma Icons.
 *
 * Source filenames are messy: spaces ("product hunt.svg"), uppercase
 * ("Info.svg"), and leading digits ("2-tap.svg"). These helpers turn any
 * filename into a stable URL slug and a valid PascalCase React component name.
 */

const NUMBER_WORDS: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

/** "Product Hunt" / "arrow_right" / "Info" -> "product-hunt" / "arrow-right" / "info" */
export function slugify(input: string): string {
  return input
    .replace(/\.svg$/i, "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-") // any run of non-alnum -> single dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .replace(/-{2,}/g, "-"); // collapse repeats
}

/**
 * JS reserved words. An icon named "delete"/"switch" would otherwise produce an
 * illegal `export const delete` in the core package (the camelCase form is the
 * one that collides; the PascalCase React name is legal but we suffix it too so
 * the component name and core export stay in lockstep).
 */
const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for",
  "function", "if", "import", "in", "instanceof", "new", "null", "return", "super",
  "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while",
  "with", "yield", "let", "static", "await", "async", "implements", "interface",
  "package", "private", "protected", "public",
]);

/**
 * "arrow-right" -> "ArrowRight". A leading digit is illegal in a JS identifier,
 * so "2-tap" becomes "Two" + "Tap" -> "TwoTap". Reserved words ("delete",
 * "switch") get an "Icon" suffix -> "DeleteIcon".
 */
export function toPascalCase(slug: string): string {
  const parts = slug.split("-").filter(Boolean);
  let out = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  if (/^[0-9]/.test(out)) {
    out = NUMBER_WORDS[out.charAt(0)] + out.slice(1);
  }
  // Reserved only if the whole identifier equals a keyword (always lowercase),
  // i.e. single-word names like "delete" / "switch".
  if (RESERVED.has(out.charAt(0).toLowerCase() + out.slice(1))) {
    out += "Icon";
  }
  return out;
}

/** Lower-camelCase identifier for the core data export ("arrowRight"). */
export function toCamelCase(slug: string): string {
  const pascal = toPascalCase(slug);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
