# duma-icons

Framework-agnostic hand-drawn icon data + metadata.

```bash
npm i duma-icons
```

```ts
import { arrowRight, toSvg } from "duma-icons";

arrowRight; // { name: "ArrowRight", viewBox: "0 0 151 84", body: "<path .../>" }

// serialize to a standalone SVG string (for copy / download)
const svg = toSvg(arrowRight, { size: 64, color: "#0a0a0a" });
```

```ts
import { metadata } from "duma-icons/metadata";
// [{ name, slug, category, viewBox, aliases, tags }, ...] — drives search/catalog
```

Icon `body` uses `currentColor` and has namespaced ids, so any renderer can
inline it safely. Each icon is its own module, so bundlers tree-shake unused
icons away.
