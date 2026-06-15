import { optimize, type Config } from "svgo";

export interface OptimizedSvg {
  /** viewBox preserved from source so aspect ratio is never lost. */
  viewBox: string;
  /** Inner markup (paths/g/defs) with black -> currentColor and prefixed ids. */
  body: string;
  /** True if any visible (non clip-rect) white fill was detected. */
  hasVisibleWhite: boolean;
}

/**
 * SVGO config, parameterized per icon so clipPath/gradient ids are namespaced
 * with the icon slug. Without this, every icon's `id="clip0"` collides when
 * two icons render on the same page.
 */
function buildConfig(slug: string): Config {
  return {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            // We strip width/height ourselves but MUST keep the viewBox.
            removeViewBox: false,
            // Hand-drawn paths can change shape if merged aggressively.
            mergePaths: false,
            // Knockouts rely on fill-rule / clip-rule.
            removeUselessStrokeAndFill: false,
            cleanupIds: false,
          },
        },
      },
      // Drop width/height attributes; the component derives size from viewBox.
      "removeDimensions",
      // black (and #000 / #000000) -> currentColor. White is left intact so
      // clipPath rects / intentional knockouts are not recolored.
      {
        name: "convertColors",
        params: {
          currentColor: /^(#0{3}|#0{6}|black)$/i,
        },
      },
      // Namespace every id and its url(#...) references with the icon slug.
      {
        name: "prefixIds",
        params: {
          prefix: () => `duma-${slug}`,
          delim: "-",
        },
      },
    ],
  };
}

const SVG_OPEN = /<svg\b[^>]*>/i;
const SVG_CLOSE = /<\/svg>\s*$/i;
const VIEWBOX = /viewBox="([^"]+)"/i;

export function optimizeSvg(raw: string, slug: string): OptimizedSvg {
  const result = optimize(raw, buildConfig(slug));
  const data = result.data;

  const viewBoxMatch = data.match(VIEWBOX);
  if (!viewBoxMatch) {
    throw new Error(`No viewBox after optimization for "${slug}"`);
  }
  const viewBox = viewBoxMatch[1]!.trim();

  const body = data.replace(SVG_OPEN, "").replace(SVG_CLOSE, "").trim();

  // Heuristic: a white fill in the *rendered* tree may be intended negative
  // space worth a manual look for a monochrome set. Clip-path rects live inside
  // <defs>/<clipPath> (and SVGO rewrites them to <path>), so strip those first
  // to avoid false positives.
  const rendered = body
    .replace(/<defs>[\s\S]*?<\/defs>/gi, "")
    .replace(/<clipPath[\s\S]*?<\/clipPath>/gi, "");
  const hasVisibleWhite = /fill="(?:#fff(?:fff)?|white)"/i.test(rendered);

  return { viewBox, body, hasVisibleWhite };
}
