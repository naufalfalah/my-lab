# CLAUDE.md

## Project Overview

**my-lab** is a static website for step-by-step hands-on labs, inspired by Google Codelabs.
Each lab is split into steps, with a sidebar for step navigation, Previous/Next buttons, and an estimated duration.

**Current phase:** a single lab only. No CRUD, no database, no auth, no CMS.
Content lives as files in the repo, and adding or editing a lab means editing a file and committing it.

## Tech Stack

- **Framework:** Astro 7 (static output, `output: 'static'`), Node >= 22.23.4
- **Content:** MDX via Astro Content Collections (`glob` loader, `z` from `astro/zod` = Zod v4)
- **Markdown processor:** Sätteri (Astro 7 default). It does **not** run remark/rehype plugins. Write Sätteri `hastPlugins`/`mdastPlugins` and register them in `satteri({...})` in `astro.config.mjs`. Do not add `@astrojs/markdown-remark` or `markdown.rehypePlugins`.
- **Styling:** plain CSS with CSS variables in `src/styles/global.css` (no UI library unless asked), light/dark via `prefers-color-scheme`
- **Client JS:** vanilla, inline in `LabLayout.astro` (no framework)
- **Deploy:** GitHub Pages via `.github/workflows/deploy.yml`
- **Package manager:** npm

## Language Rules

- **UI text** (buttons, labels, nav, page titles, meta): **English**
- **Lab content** (MDX files under `src/content/labs/`): **Bahasa Indonesia**
- Code, identifiers, comments, and commit messages: English

## Project Structure

```
src/
  content/
    labs/
      <lab-slug>.mdx        # one file per lab (file name = URL slug)
      images/<lab-slug>/    # images for that lab, referenced relatively
  content.config.ts         # collection schema (zod)
  layouts/
    BaseLayout.astro        # <head>, site header
    LabLayout.astro         # sidebar + steps + pager + inline step JS
  components/
    Callout.astro           # note | tip | warning
  lib/
    satteri-steps.mjs       # wraps each top-level `##` in <section class="step" id="step-N">
    url.ts                  # withBase() for internal links
    format.ts               # duration/level/date formatting
  pages/
    index.astro             # lab list (even with one lab)
    labs/[slug].astro       # lab page
    404.astro
  styles/
    global.css
public/                     # favicon and truly static files only
```

`src/content/labs/contoh-lab.mdx` is a placeholder that demonstrates the format. Replace it with the first real lab.

## Lab Content Format

One MDX file per lab. Each `##` heading is one step. Do not use `#` (h1) inside the body; the title comes from frontmatter.

```mdx
---
title: "Membuat REST API dengan Express"
summary: "Short description shown on the lab list."
duration: 45            # total minutes
level: "beginner"       # beginner | intermediate | advanced
tags: ["nodejs", "api"]
updated: 2026-11-20
---

## Pengantar
...

## Persiapan Environment
...

## Penutup
...
```

- Frontmatter is validated by the zod schema in `src/content.config.ts`. Update the schema when adding fields.
- Images go in `src/content/labs/images/<slug>/` and are referenced relatively: `![alt](./images/<slug>/file.png)`. Astro processes them, so the base path is handled. Never use absolute `/images/...` paths.
- Reusable content blocks (e.g. `<Callout type="warning">`) live in `src/components/` and are imported in MDX.
- Only top-level `##` become steps. Do not put `##` inside components, or the sidebar and step numbering will drift apart.

## Lab Page Behavior

- Steps are wrapped at build time by `src/lib/satteri-steps.mjs`; the sidebar list comes from `render()` headings with depth 2. Both count top-level `##` in order and must stay in sync.
- One step is shown at a time; the active step lives in the URL hash (`#step-3`) so it can be shared and survives refresh. A hash pointing at any element inside a step opens that step.
- Sidebar lists all steps with the current one highlighted; Back/Next (and Done on the last step) sit below the content.
- Header shows total duration; sidebar shows the remaining estimate, computed from `duration` weighted by each step's word count.
- Without JavaScript, all steps render in sequence and the sidebar works as anchor links. JS adds `is-ready` to `.lab` and switches to one-step-at-a-time. The step script is inline so there is no flash of all steps.
- On screens under 900px the sidebar collapses into a "Step N of M" toggle.

## GitHub Pages Notes

- `site` and `base` are read from `SITE_URL` and `BASE_PATH` env vars. The workflow fills them from `actions/configure-pages`, so project pages, user pages and custom domains all work without editing the config.
- Never hardcode root-relative links like `/labs/...`. Use `withBase()` from `src/lib/url.ts`.
- `trailingSlash: 'always'`: internal page links end with `/`.
- In the repo settings, Pages source must be set to "GitHub Actions". Deploys run on push to `main`.

## Commands

```bash
npm install
npm run dev                          # local dev server (base = /)
BASE_PATH=/my-lab npm run dev        # test a sub-path deploy locally
npm run build                        # static build to dist/
npm run preview                      # preview the production build
```

Run `npm run build` before considering a change done; it catches frontmatter schema errors and broken MDX. For link or asset changes, also build once with `BASE_PATH=/my-lab` and check the output paths.

## Out of Scope (for now)

Do not add these unless explicitly asked:

- CRUD, admin panel, database, or headless CMS
- Authentication or user accounts
- Server-side rendering / API routes
- Search, i18n routing, analytics, comments

Keep the structure simple enough that moving content to a database later only means replacing the content collection loader.
