# CLAUDE.md — How to build an explainer

This repo is a collection of **interactive, self-contained HTML explainers**. This
file is the generation guide: **when the user gives you a topic, your job is to
produce a complete explainer in the style described below and register it on the
landing page.** Follow it precisely — it is what keeps every explainer feeling
like one cohesive site.

> Inspiration & north star: [explainers.blog](https://explainers.blog) (Erik
> Kennedy) and [paraschopra.github.io/explainers](https://paraschopra.github.io/explainers/).
> The guiding philosophy, quoted: *great explanations on **the efficient frontier
> of accurate and accessible**. You don't understand it until you can predict it.
> No can-kicking. No jargon.*

---

## The job: producing an explainer (workflow checklist)

When asked to explain a topic, do all of these, in order:

1. **Pick a short, kebab-case slug** (e.g. `fourier-transform`, `why-sky-blue`,
   `diffusion`). Keep it 1–3 words.
2. **Copy `template/index.html` → `<slug>/index.html`.** Never start from a blank
   file. The template carries the shared design tokens and the demo harness.
3. **Write the explainer** into that file — content, sections, and interactive
   demos (rules below). Replace every `[[ ... ]]` placeholder; delete unused bits.
4. **Register it on the landing page:** prepend one object to the `EXPLAINERS`
   array in the root `index.html` (newest first):
   ```js
   { slug: 'your-slug', title: '...', description: '...', date: 'Jun 2026' }
   ```
5. **Keep the project records** (house conventions): append the user's prompt to
   `PROMPT.md`, and add/update a `memory/YYYY-MM-DD.md` summary of what you built.
6. **Verify in a real browser** before declaring done: no console errors, every
   demo responds to its controls, layout holds at mobile width. Run `npm test`
   (the smoke test auto-discovers the new folder). See "Verifying" below.

A finished explainer is **one file**: `<slug>/index.html` with inline `<style>`
and `<script>`. No external CSS/JS files, no build step, no framework.

---

## Voice & pedagogy (the writing)

The explanation matters more than the visuals. Aim for *accurate AND accessible*.

- **Open on a concrete scene, not a definition.** Drop the reader into a vivid,
  lived moment (Erik's sky piece starts with looking up; the Fourier piece starts
  in a coffee shop with Shazam). Make them *feel the question* before naming it.
- **Headings are curiosity, phrased as questions.** "What even IS a sound?",
  "Wait, why isn't the sky violet?", "Why should I care?". Number the main ones.
- **Follow the arc:** intuition → core mechanism → the complication a smart reader
  just thought of → real-world applications → a **prediction challenge** → "the
  bigger picture" synthesis → a **further-reading list**.
- **One idea per paragraph. Build, don't dump.** Each step should feel inevitable
  given the last.
- **Analogy for every hard concept.** Resonance ≈ pushing a kid on a swing;
  a water droplet ≈ a tiny prism. Concrete beats abstract every time.
- **Warm, conversational, first person.** Talk *to* the reader ("you"). Use
  parentheticals for quick asides. Emoji are fine but **sparing** (a 🧐 or 🔮, not
  a parade).
- **Layer the depth with "Well, ackshually 🧐" asides.** Put nuance, caveats, and
  the technically-precise-but-distracting bits inside `<details class="aside">`.
  Skimmers skip them; the curious get rewarded. This lets the main text stay
  honest *and* simple.
- **Math, gently.** Never lead with an equation. Explain the mechanism in plain
  words first, *then* show the formula prefaced with a "don't panic", *then*
  annotate every symbol. Only enable KaTeX (commented block in the template) if
  you actually need equations.
- **End by closing the loop** — return to the opening scene, now that the reader
  can see it differently.
- **Then add a "Further reading" list** (after the synthesis), in the spirit of
  Paras Chopra's explainers: a short, *annotated* set of 5–10 excellent resources
  — a primary source, a great visual video, a book, an interactive tool — each
  with one line on why it's worth their time. Make the titles clickable links.
- **Length:** there's no hard cap — go as long as the topic genuinely needs
  (commonly **3,000–6,000+ words**, more for big topics). Length is good *when
  every section earns its place*: prefer adding another demo, a worked example, or
  a deeper layer over truncating. The enemy is padding, never length — cut filler,
  keep substance.
- **No can-kicking:** never explain a term with another unexplained term. If you
  name something, you've already built the intuition for it.

---

## Interactivity (the demos)

Interactivity is the spine, not garnish. The reader should *do*, not just read.

- **Every key concept gets a manipulable demo.** If a paragraph asserts "as X
  goes up, Y bunches together," there should be a slider for X that shows it.
- **Number and caption every demo** (`<span class="num">Demo 3.</span> …`). The
  caption tells the reader *what to try* and *what to notice*.
- **Use the right primitive:** `<canvas>` for continuous/animated visuals (waves,
  particles, fields, plots); inline **SVG or DOM** for diagrams and labeled
  figures. Reuse the template's `setupCanvas(canvas, draw)` helper — it gives you
  crisp HiDPI rendering and a reduced-motion-safe animation loop for free.
- **Vanilla JS only.** No React/Vue/d3-by-default. A tiny CDN library is allowed
  *only* if a topic truly needs it (e.g. KaTeX for math) — prefer hand-rolled.
- **Animation respects `prefers-reduced-motion`.** The helper already guards this;
  don't auto-start motion for those users. Keep the static frame meaningful.
- **Include a prediction challenge** near the end (the `.predict` box): pose a
  *new* scenario and ask the reader to predict the outcome with the mental model
  they just built, then reveal the answer. This is the litmus test of real
  understanding.

---

## Technical rules

- **Self-contained single file.** `<slug>/index.html` inlines all CSS and JS.
  This is non-negotiable — it's what makes each explainer portable and the repo
  build-free.
- **Relative links only.** Link home as `../` and between explainers as
  `../other-slug/`. Never use root-absolute paths like `/other-slug/` — the site
  is served under a `/<repo>/` subpath on GitHub Pages and absolute paths break.
- **Copy the design tokens verbatim** from the template's `:root` block so the
  collection stays visually consistent. Only override an accent for a strong
  topic reason.
- **Responsive + mobile-first.** It must read well at 360px wide. Test it.
- **Accessible:** label every control (`<label for>`), give canvases an
  `aria-label` describing what they show, ensure keyboard focus works
  (`:focus-visible` is styled), and provide `alt` text on any `<img>`.
- **Theme through the CSS variables** — never hardcode colors; always use
  `var(--accent)` etc., including inside canvas drawing code (read them with
  `getComputedStyle`). The site is light-only — there is no dark-mode block.
- **Performance:** keep it light. No giant assets. Pause animation loops when not
  needed.

---

## Design tokens (reference)

Defined in `template/index.html`; summarized here. Use the variables, not raw hex.

| Token | Value | Use |
| --- | --- | --- |
| `--font-prose` | Georgia / Iowan serif stack | body prose |
| `--font-ui` | system sans stack | headings, controls, captions |
| `--font-mono` | system mono stack | code |
| `--bg` | `#fdfdfc` | warm paper background |
| `--surface` | `#ffffff` | cards, demos, asides |
| `--text` | `#1a1a1a` | ink |
| `--muted` | `#6b6b6b` | secondary text |
| `--border` | `#e6e4df` | hairlines |
| `--accent` | `#2563eb` | the one accent (links, demo lines, buttons) |
| `--accent-soft` | `#eaf0ff` | accent backgrounds |
| `--measure` | `680px` | reading column width |
| `--radius` | `12px` | corner rounding |

The palette is light-only. Components: `.prose` text blocks, `figure.demo`
(canvas/SVG + `.controls` + numbered `figcaption`), `<details class="aside">`
for "ackshually" notes, `.predict` challenge box, `.toc`, and the header/footer.

---

## Anti-patterns (don't)

- ❌ A wall of text with no demo to play with.
- ❌ Opening with a dictionary definition or "X is a fundamental concept in…".
- ❌ Jargon before intuition; equations before words.
- ❌ External `.css`/`.js` files, frameworks, or a build step.
- ❌ Root-absolute links (`/slug/`) — they break on Pages.
- ❌ Auto-playing motion that ignores `prefers-reduced-motion`.
- ❌ Decorative demos that don't teach the specific point in the adjacent text.
- ❌ Ending cold with no "Further reading" — give a curious reader somewhere to go next.

---

## Verifying

```bash
npm install                  # first time only
npx playwright install chromium
npm test                     # smoke-tests landing + template + every <slug>/index.html
npm run serve                # then open http://localhost:4173 to eyeball it
```

The smoke test auto-discovers explainer folders, so a new one is covered the
moment you create it. Manually confirm: demo controls actually change the visual,
the "ackshually" `<details>` toggles, and nothing logs an error in the console.

---

See `ARCHITECTURE.md` for the big picture and `README.md` for deployment.
