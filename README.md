# Explainers

A collection of **interactive, visual HTML explainers** — one topic per folder,
each a single self-contained `index.html` with inline CSS and JavaScript. No
build step, no framework. Deployed as a static GitHub Pages site.

Inspired by [explainers.blog](https://explainers.blog) and
[Paras Chopra's explainers](https://paraschopra.github.io/explainers/). The
guiding idea: explanations on *the efficient frontier of accurate and accessible* —
*you don't understand it until you can predict it.*

## Repo layout

```
.
├── index.html          # landing page — renders cards from an inline EXPLAINERS manifest
├── CLAUDE.md           # the style guide: how an explainer is written & built
├── ARCHITECTURE.md     # the big picture
├── template/
│   └── index.html      # canonical skeleton to copy for a new explainer
├── <slug>/
│   └── index.html      # each explainer lives in its own folder
├── tests/              # Playwright smoke tests (auto-discover every explainer)
└── memory/             # dated work summaries
```

## How to add an explainer

1. Copy `template/` to `your-slug/` (short, kebab-case).
2. Fill in `your-slug/index.html` — replace every `[[ ... ]]` placeholder. Follow
   the voice, structure, and interactivity rules in [`CLAUDE.md`](CLAUDE.md).
3. Prepend one entry to the `EXPLAINERS` array in the root `index.html`:
   ```js
   { slug: 'your-slug', title: '…', description: '…', date: 'Jun 2026' }
   ```
4. Verify (below), then commit.

Each explainer must stay **self-contained** (no external CSS/JS) and use
**relative links** (`../`, `../other-slug/`) so it works under the Pages subpath.

## Develop & test

```bash
npm install                      # first time only
npx playwright install chromium  # first time only
npm test                         # smoke-test landing + template + every explainer
npm run serve                    # serve at http://localhost:4173 to view locally
```

The smoke test auto-discovers explainer folders, so new ones are covered the
moment you create them. It asserts each page loads with no console errors, has at
least one interactive control, and has a heading.

## Deploy (GitHub Pages)

This is a no-build static site, so deploy straight from the branch:

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Source: "Deploy from a branch".**
3. Choose branch **`main`** and folder **`/ (root)`**. Save.
4. The site goes live at `https://<user>.github.io/<repo>/`.

`.nojekyll` is already present so GitHub serves every file and folder verbatim
(no Jekyll processing). Because the site lives under a `/<repo>/` subpath, all
internal links are relative — keep them that way.

## License

[MIT](LICENSE) © digster.
