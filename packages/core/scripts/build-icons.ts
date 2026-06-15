/**
 * Generator for `duma-icons` (core).
 *
 * Reads icons/SVG/<category>/*.svg, optimizes each (currentColor + namespaced
 * ids, preserved viewBox), and emits framework-agnostic IconData modules plus a
 * metadata manifest. Deterministic: re-running produces identical output.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifest, optimizeSvg, type IconRecord } from "@duma/tooling";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");
const repoRoot = join(pkgRoot, "..", "..");
const svgRoot = join(repoRoot, "icons", "SVG");

const genDir = join(pkgRoot, "src", "generated");
const iconsDir = join(genDir, "icons");

function reset() {
  rmSync(genDir, { recursive: true, force: true });
  mkdirSync(iconsDir, { recursive: true });
}

function emitIcon(icon: IconRecord, viewBox: string, body: string) {
  const content =
    `import type { IconData } from "../../types.js";\n\n` +
    `export const ${icon.camelName}: IconData = {\n` +
    `  name: ${JSON.stringify(icon.name)},\n` +
    `  viewBox: ${JSON.stringify(viewBox)},\n` +
    `  body: ${JSON.stringify(body)},\n` +
    `};\n\nexport default ${icon.camelName};\n`;
  writeFileSync(join(iconsDir, `${icon.slug}.ts`), content);
}

function main() {
  reset();
  const { icons, renamed } = buildManifest(svgRoot);

  const barrel: string[] = [];
  const meta: string[] = [];
  const whiteFlags: string[] = [];

  for (const icon of icons) {
    const raw = readFileSync(icon.sourcePath, "utf8");
    const { viewBox, body, hasVisibleWhite } = optimizeSvg(raw, icon.slug);
    emitIcon(icon, viewBox, body);

    barrel.push(`export { ${icon.camelName} } from "./icons/${icon.slug}.js";`);
    meta.push(
      `  { name: ${JSON.stringify(icon.name)}, slug: ${JSON.stringify(icon.slug)}, ` +
        `category: ${JSON.stringify(icon.category)}, viewBox: ${JSON.stringify(viewBox)}, ` +
        `aliases: ${JSON.stringify(icon.aliases)}, tags: ${JSON.stringify(icon.tags)} },`,
    );
    if (hasVisibleWhite) whiteFlags.push(icon.slug);
  }

  writeFileSync(join(genDir, "index.ts"), barrel.join("\n") + "\n");
  writeFileSync(
    join(genDir, "metadata.ts"),
    `import type { IconMeta } from "../types.js";\n\n` +
      `export const metadata: IconMeta[] = [\n${meta.join("\n")}\n];\n`,
  );

  // Report
  console.log(`✓ generated ${icons.length} icons`);
  if (renamed.length) {
    console.log(`\n${renamed.length} de-collided (kept original as alias):`);
    for (const r of renamed) console.log(`  ${r.category}/${r.from} -> ${r.to}`);
  }
  if (whiteFlags.length) {
    console.log(`\n⚠ ${whiteFlags.length} icons have a visible white fill — review for knockouts:`);
    console.log("  " + whiteFlags.join(", "));
  }
}

main();
