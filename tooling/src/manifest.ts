import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { slugify, toPascalCase, toCamelCase } from "./naming.js";

export interface IconRecord {
  /** Final unique URL slug (de-collided). */
  slug: string;
  /** Final unique PascalCase component name. */
  name: string;
  /** Lower-camel name for the core data export. */
  camelName: string;
  /** Source category (folder name). */
  category: string;
  /** Absolute path to the source .svg. */
  sourcePath: string;
  /** Original slug before any de-collision (kept for reference + search). */
  originalSlug: string;
  /** Search aliases (includes original slug when renamed). */
  aliases: string[];
  /** Search tags derived from name + category. */
  tags: string[];
}

export interface ManifestResult {
  icons: IconRecord[];
  /** Icons that were renamed to resolve a cross-category name collision. */
  renamed: { from: string; to: string; category: string }[];
}

function listDirs(root: string): string[] {
  return readdirSync(root)
    .filter((d) => statSync(join(root, d)).isDirectory())
    .sort();
}

function listSvgs(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .sort();
}

/**
 * Walk icons/SVG/<category>/*.svg and build a deterministic, collision-free
 * manifest. The 12 duplicate base names (arrow-down, camera, ...) are resolved
 * by letting the alphabetically-first category keep the plain name and
 * prefixing later ones with their category. Originals are kept as aliases so
 * search still finds them.
 */
export function buildManifest(svgRoot: string): ManifestResult {
  const seenSlug = new Map<string, string>(); // slug -> owning category
  const seenName = new Set<string>();
  const icons: IconRecord[] = [];
  const renamed: ManifestResult["renamed"] = [];

  for (const category of listDirs(svgRoot)) {
    const categorySlug = slugify(category);
    const dir = join(svgRoot, category);

    for (const file of listSvgs(dir)) {
      const baseSlug = slugify(file);
      let slug = baseSlug;
      const aliases = new Set<string>();

      // De-collide slug across categories.
      if (seenSlug.has(slug)) {
        slug = `${categorySlug}-${baseSlug}`;
        aliases.add(baseSlug);
        renamed.push({ from: baseSlug, to: slug, category });
      }
      // Extremely defensive: collide again -> append a counter.
      let counter = 2;
      while (seenSlug.has(slug)) {
        slug = `${categorySlug}-${baseSlug}-${counter++}`;
      }

      let name = toPascalCase(slug);
      while (seenName.has(name)) {
        name = `${toPascalCase(categorySlug)}${toPascalCase(baseSlug)}`;
        if (seenName.has(name)) name = `${name}Icon`;
      }

      seenSlug.set(slug, category);
      seenName.add(name);

      const tags = Array.from(
        new Set([...baseSlug.split("-"), categorySlug, ...slug.split("-")]),
      ).filter(Boolean);

      icons.push({
        slug,
        name,
        camelName: toCamelCase(slug),
        category: categorySlug,
        sourcePath: join(dir, file),
        originalSlug: baseSlug,
        aliases: Array.from(aliases),
        tags,
      });
    }
  }

  icons.sort((a, b) => a.name.localeCompare(b.name));
  return { icons, renamed };
}
