/** Renderable icon data. `body` is optimized inner SVG markup using currentColor. */
export interface IconData {
  /** PascalCase name, e.g. "ArrowRight". */
  name: string;
  /** Original aspect ratio, e.g. "0 0 151 84". */
  viewBox: string;
  /** Inner SVG markup (paths/g/defs) with namespaced ids and currentColor. */
  body: string;
}

/** Search/catalog metadata for one icon. */
export interface IconMeta {
  name: string;
  slug: string;
  category: string;
  viewBox: string;
  aliases: string[];
  tags: string[];
}
