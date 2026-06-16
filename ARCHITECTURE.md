# Architecture

The big-picture design of this repo and the "why" behind it.

## What this is

A static collection of interactive explainers. Each explainer is a **single,
self-contained `index.html`** (inline `<style>` + `<script>`) living in its own
slug folder at the repo root. There is **no build system, no framework, and no
server** — the deployed site is exactly the files in the repo.

## Why self-contained, no-build

- **Portability.** An explainer is one file you can open, fork, or share on its
  own. Nothing breaks if it's moved.
- **AI-friendly generation.** A topic maps to exactly one artifact, so it can be
  produced (and reviewed) in a single pass. This is the core workflow — see
  [`CLAUDE.md`](CLAUDE.md).
- **Zero deploy complexity.** GitHub Pages serves the raw files. `.nojekyll`
  disables Jekyll so nothing is rewritten or skipped.

The trade-off: visual consistency is enforced by *convention*, not shared code.
The shared design tokens live in `template/index.html` and are copied into each
explainer. `template/` is the source of truth for that design language; start
every new explainer by copying it.

## Components & data flow

- **`index.html` (landing).** Holds an inline `EXPLAINERS` manifest array
  (`{slug, title, description, date}`). Client-side JS renders it into a card
  grid, newest first, with an empty state when the array is empty. Adding an
  explainer = creating its folder + prepending one manifest entry. The manifest
  is the only coupling point between an explainer and the rest of the site.
- **`<slug>/index.html` (an explainer).** Standalone page. Links back to the
  landing page with `../` and to siblings with `../other-slug/`. All links are
  **relative** because the site is served under a `/<repo>/` subpath on Pages —
  root-absolute paths (`/slug/`) would break.
- **`template/index.html`.** Canonical skeleton: design-token CSS, reading
  layout, table of contents, the `setupCanvas()` demo harness, an example
  `figure.demo`, an "ackshually" `<details>` aside, a prediction box, and a
  footer. New explainers are copies of this.

## The demo harness

`template/index.html` defines `setupCanvas(canvas, draw)`, reused by every
explainer's demos. It handles two things explainers must get right:

- **HiDPI crispness** — scales the canvas backing store by `devicePixelRatio`.
- **Motion accessibility** — its `requestAnimationFrame` loop never auto-starts
  when the OS `prefers-reduced-motion` is set.

Interactivity convention: state in one object → control `input` events mutate it →
`redraw()` repaints. Sliders sync their value into an `<output>` label.

## Testing

`tests/explainers.spec.js` (Playwright) **auto-discovers** every `*/index.html`
(excluding `template/` and `node_modules/`) plus the landing page, and asserts
each loads with no console errors, exposes at least one interactive control, and
has a heading. New explainers are covered automatically. `playwright.config.js`
spins up a static file server (`python3 -m http.server`) as the test `baseURL`.

## Deployment

GitHub Pages, "Deploy from a branch" → `main` / root. No CI build needed. See
[`README.md`](README.md) for the click-path.
