/**
 * Generator for `duma-icons-react`.
 *
 * Emits one self-contained React component per icon (inlining optimized body +
 * viewBox) plus a tree-shakeable barrel. No runtime dependency on `duma-icons`.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifest, optimizeSvg } from "@duma/tooling";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");
const repoRoot = join(pkgRoot, "..", "..");
const svgRoot = join(repoRoot, "icons", "SVG");

const genDir = join(pkgRoot, "src", "generated");
const iconsDir = join(genDir, "icons");

function main() {
  rmSync(genDir, { recursive: true, force: true });
  mkdirSync(iconsDir, { recursive: true });

  const { icons } = buildManifest(svgRoot);
  const barrel: string[] = [];

  for (const icon of icons) {
    const raw = readFileSync(icon.sourcePath, "utf8");
    const { viewBox, body } = optimizeSvg(raw, icon.slug);

    const component =
      `import { forwardRef } from "react";\n` +
      `import { Icon } from "../../Icon.js";\n` +
      `import type { IconProps } from "../../types.js";\n\n` +
      `const ${icon.name} = forwardRef<SVGSVGElement, IconProps>((props, ref) => (\n` +
      `  <Icon ref={ref} viewBox=${JSON.stringify(viewBox)} body={${JSON.stringify(body)}} {...props} />\n` +
      `));\n` +
      `${icon.name}.displayName = ${JSON.stringify(icon.name)};\n\n` +
      `export default ${icon.name};\n`;
    writeFileSync(join(iconsDir, `${icon.name}.tsx`), component);
    barrel.push(`export { default as ${icon.name} } from "./icons/${icon.name}.js";`);
  }

  writeFileSync(join(genDir, "index.ts"), barrel.join("\n") + "\n");
  console.log(`✓ generated ${icons.length} React components`);
}

main();
