# Contributing to Duma Icons

:tada: First off, thanks for taking the time to contribute! :tada:

The following is a set of guidelines for contributing to Duma Icons. Feel free
to propose changes to this document in a pull request.

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Pull Requests

Feel free to open a pull request to contribute to this project.

**Working on your first Pull Request?** You can learn how from this _free_ series
[How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

Guidelines for pull requests:

- **Make your commit messages as descriptive as possible.** Explain anything that
  the file diffs themselves won't make apparent.
- **Document your pull request.** Explain your change, link to the relevant issue,
  and add screenshots when adding or changing icons.
- **Target the `main` branch.** Most bug fixes and new features should go to `main`.
- **Include only related work.** PRs with unrelated commits won't be accepted.

## Contributing Icons

We love contributions of new icons! Duma Icons is a **hand-drawn, filled** icon
set, so consistency of style is important.

### Source of truth

Every icon lives as a single SVG under `icons/SVG/<category>/<name>.svg`. The
npm packages and the gallery are all **generated** from these files — you never
edit generated code by hand.

### Icon guidelines

To keep the set consistent, please make sure your SVG:

- Uses a square **`viewBox`** (the generator strips `width`/`height` but keeps
  the `viewBox`).
- Is a **filled** shape (no strokes — there is no stroke-width control).
- Uses `fill="black"` for the artwork. The generator remaps it to `currentColor`
  so icons inherit text color.
- Has a clear, lowercase, kebab-case file name (e.g. `arrow-circle-down.svg`).
- Lives in the most appropriate existing category folder under `icons/SVG/`.

### Submitting multiple icons

If you want to submit multiple icons, group related ones and keep unrelated icons
in separate PRs. That makes reviewing easier and keeps each thread scoped. For
example, don't open one PR with `arrow-up`, `bicycle`, and `arrow-down` — split
it into one PR for the arrows and another for `bicycle`.

## Icon Requests

Before creating an icon request, please search existing issues to see if someone
has requested it already. If there's an open request, add a :+1:. Otherwise,
[open a new icon request issue](https://github.com/marian-dudych/duma-icons/issues/new)
with as much detail as possible (and a reference image if you have one).

## Development

You'll need:

- [Node.js 18+](https://nodejs.org)
- [pnpm 9](https://pnpm.io/installation) (`corepack enable` or `npm i -g pnpm@9`)

After cloning the project, install dependencies (this also links the workspace
packages):

```sh
pnpm install
```

### Workspaces

This repo is a [pnpm workspace](https://pnpm.io/workspaces) monorepo. The
workspace layout is defined in [`pnpm-workspace.yaml`](./pnpm-workspace.yaml):

```
icons/SVG/<category>/*.svg   source art (input, committed)
tooling/                     @duma/tooling — naming, SVGO optimize, manifest (internal)
packages/core/               duma-icons        (npm)
packages/react/              duma-icons-react  (npm)
apps/web/                    Next.js gallery
```

### Generated code

Icons are the single source of truth. To distribute them, we **generate** code
into `packages/*/src/generated/` — per-icon modules, an index, type files, and a
metadata manifest. This output is git-ignored and recreated on demand, so don't
commit it.

### Commonly used scripts

Run these from the repo root:

```sh
pnpm gen          # regenerate icon modules + metadata from icons/SVG
pnpm build        # generate + bundle all packages (turbo)
pnpm test         # naming + React render tests
pnpm typecheck    # type-check every package
```

You can scope a command to a single package with `--filter`:

```sh
pnpm --filter duma-icons build
pnpm --filter duma-icons-react test
```

### Running the gallery locally

Build the packages first so the workspace deps resolve, then start the dev server:

```sh
pnpm --filter duma-icons build && pnpm --filter duma-icons-react build
pnpm --filter @duma/web dev      # http://localhost:3000
```

### Testing

When adding features (for example to the React component), please cover them with
tests. CI runs `gen → typecheck → test → build` on every pull request, so make
sure all of those pass locally before pushing.

## Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets).
If your change affects a published package, add a changeset:

```sh
pnpm changeset
```

Maintainers handle version bumps and npm publishing via the release workflow.

## Support

If you need help with your contribution, please open a
[GitHub issue or discussion](https://github.com/marian-dudych/duma-icons/issues).
