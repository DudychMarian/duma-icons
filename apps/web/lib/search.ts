import Fuse from "fuse.js";
import type { IconMeta } from "duma-icons/metadata";

/** Fuzzy search over name, slug, aliases and tags. */
export function createSearch(metadata: IconMeta[]) {
  const fuse = new Fuse(metadata, {
    keys: [
      { name: "name", weight: 2 },
      { name: "slug", weight: 2 },
      { name: "aliases", weight: 1.5 },
      { name: "tags", weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
  return (query: string): IconMeta[] => {
    const q = query.trim();
    if (!q) return metadata;
    return fuse.search(q).map((r) => r.item);
  };
}
