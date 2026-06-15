<p align="center">
  <a href="https://github.com/marian-dudych/duma-icons">
    <img src="apps/web/public/logo.svg" alt="Duma Icons — a hand-drawn, open-source icon set." width="120">
  </a>
</p>

<h1 align="center">Duma Icons</h1>

<p align="center">
  A hand-drawn, open-source icon set — 450+ SVG icons across 15 categories,
  shipped as framework-agnostic data and React components.
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license"></a>
  <a href="https://www.npmjs.com/package/duma-icons"><img src="https://img.shields.io/npm/v/duma-icons" alt="duma-icons version"></a>
  <a href="https://www.npmjs.com/package/duma-icons-react"><img src="https://img.shields.io/npm/v/duma-icons-react?label=duma-icons-react" alt="duma-icons-react version"></a>
  <a href="https://github.com/marian-dudych/duma-icons/actions/workflows/ci.yml"><img src="https://github.com/marian-dudych/duma-icons/actions/workflows/ci.yml/badge.svg" alt="build status"></a>
</p>

<p align="center">
  <a href="#packages">Packages</a>
  ·
  <a href="#gallery-appsweb">Gallery</a>
  ·
  <a href="./CONTRIBUTING.md">Contributing</a>
  ·
  <a href="./CODE_OF_CONDUCT.md">Code of Conduct</a>
  ·
  <a href="./LICENSE">License</a>
</p>

---

Duma Icons is a monorepo for a hand-drawn icon set: a single SVG source of truth
in `icons/SVG/`, a framework-agnostic core data package, a React component
package, and a Lucide-style gallery web app for browsing, recoloring, resizing,
and downloading icons.

## Packages

| Logo | Package | Version | Downloads | Links |
| ---- | ------- | ------- | --------- | ----- |
| <img src="https://cdn.simpleicons.org/javascript" alt="JS logo" width="40"> | **`duma-icons`** | [![npm](https://img.shields.io/npm/v/duma-icons)](https://www.npmjs.com/package/duma-icons) | ![NPM Downloads](https://img.shields.io/npm/dw/duma-icons) | [Source](./packages/core) |
| <img src="https://cdn.simpleicons.org/react" alt="React logo" width="40"> | **`duma-icons-react`** | [![npm](https://img.shields.io/npm/v/duma-icons-react)](https://www.npmjs.com/package/duma-icons-react) | ![NPM Downloads](https://img.shields.io/npm/dw/duma-icons-react) | [Source](./packages/react) |

- **duma-icons** — `IconData` (`{ name, viewBox, body }`) per icon, a `metadata`
  manifest (`duma-icons/metadata`), and `toSvg()` for copy/download.
- **duma-icons-react** — one `forwardRef` component per icon: `<Arrow />`,
  `<Arrow color="#0a0a0a" size={64} />`, or `className="text-red-500"`.

## Layout

```
icons/SVG/<category>/*.svg   source art (input, committed)
tooling/                     @duma/tooling — naming, SVGO optimize, manifest (internal)
packages/core/               duma-icons        (npm)
packages/react/              duma-icons-react  (npm)
apps/web/                    Next.js gallery   (browse / recolor / resize / download)
```

## Requirements

Node >= 18, pnpm 9 (`corepack enable` or `npm i -g pnpm@9`).

## Commands

```bash
pnpm install          # install workspace deps
pnpm gen              # regenerate icon modules + metadata from icons/SVG
pnpm build            # generate + bundle all packages (turbo)
pnpm test             # naming + React render tests
pnpm typecheck

# gallery web app (build the packages first so the workspace deps resolve)
pnpm --filter duma-icons build && pnpm --filter duma-icons-react build
pnpm --filter @duma/web dev      # http://localhost:3000
```

## Gallery (apps/web)

Next.js App Router app modeled on lucide.dev/icons:

- Fuzzy **search** over name, slug, aliases and tags (Fuse.js).
- **Category** filter sidebar with counts.
- **Customizer**: color (presets + picker), size slider, and a light/dark/checker
  preview background. (No stroke-width control — the icons are filled.)
- Click any icon for a **detail modal**: copy SVG, copy JSX, and download SVG or
  PNG. PNG is rasterized client-side via canvas at the chosen color/size, so the
  whole app works as a static export (`output: "export"` in `next.config.mjs`).

## How generation works

`pnpm gen` runs each package's generator, which uses `@duma/tooling` to:

1. Walk `icons/SVG/<category>/*.svg` and build a deterministic manifest.
2. Resolve the 12 cross-category name collisions (alphabetically-first category
   keeps the plain name; others are category-prefixed, originals kept as search
   aliases). Leading-digit names (`2-tap`) become valid identifiers (`TwoTap`).
3. Optimize each SVG with SVGO: drop width/height but **keep the viewBox**,
   remap `fill="black"` → `currentColor`, and **namespace every id** with the
   icon slug so `clipPath` ids never collide across icons on one page.
4. Emit per-icon modules (tree-shakeable) plus a metadata manifest.

Generated output lives in `packages/*/src/generated/` and is git-ignored; it is
recreated by the `prebuild` hook before bundling.

## Releasing

Versioning + publishing use [Changesets](https://github.com/changesets/changesets).
`duma-icons` and `duma-icons-react` are version-locked.

```bash
pnpm changeset           # note a change
pnpm changeset version   # bump versions + changelog
pnpm release             # build + publish
```

CI (`.github/workflows/ci.yml`) runs gen → typecheck → test → build on every PR.
The release workflow opens a "Version Packages" PR and publishes to npm (with
provenance) when it merges. Set an `NPM_TOKEN` repo secret to enable publishing.

## Contributing

Contributions — especially new icons — are very welcome. Please read the
[contribution guidelines](./CONTRIBUTING.md) and our
[Code of Conduct](./CODE_OF_CONDUCT.md) before opening a pull request.

## License

Duma Icons is free for personal and commercial use under the [MIT License](./LICENSE).
