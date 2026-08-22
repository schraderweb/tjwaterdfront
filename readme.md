# TJ's Waterfront — Website

Official website for TJ's Waterfront. Built with Astro + Tailwind CSS.

---

## The One Rule You Must Remember

> **Everything you edit lives in `src/` (and `public/` for plain files).**
>
> `dist/` is the **build output** — it is regenerated on every build. Never edit files inside `dist/`.

How the build works:

```
 src/pages/*.astro      (pages)        ─┐
 src/components/*.astro (sections)      │
 src/data/*.ts          (text content)  ├──▶  npm run build  ──▶  dist/  ──▶  Live site
 src/assets/            (images)        │
 public/                (static files) ─┘
```

---

## Folder Map

```
◄── EDIT HERE ───────────────────────────────────────────────────────►

 src/
 ├── pages/                 The site's pages
 │   ├── index.astro          Homepage (composes the home sections below)
 │   └── [...slug].astro      Catch-all interior pages (placeholders until real pages land)
 ├── components/
 │   ├── pages/<route>/...    Components used by a single page
 │   │   └── home/              hero, sections, resources
 │   └── shared/              Reusable components used across pages
 │       ├── layout/            Navigation + page layout (Navbar)
 │       ├── sections/          Services, reviews, resources, footer, map
 │       ├── ui/                Buttons, cards, carousel
 │       └── icons/             Inline SVG icons
 ├── data/                  ⭐ TEXT CONTENT lives here (plain, easy files)
 │   ├── reviews.ts            Customer reviews
 │   ├── serviceAreas.ts       Areas served
 │   ├── helpfulResources.ts   Resources section content
 │   ├── gallery.ts            ⭐ Gallery engine — scans content/gallery/ folders automatically
 │   ├── featuredServices.ts / popularServices.ts   Homepage section content
 │   └── site.ts               Site-wide info (name, contact, links)
 ├── assets/                Images used inside components (photos, icons, logos)
 ├── content/gallery/       ⭐ GALLERY PHOTOS — one folder per category, see "How to Add Gallery Photos"
 ├── layouts/BaseLayout.astro   Shared page shell (head, nav, footer)
 ├── scripts/               Small browser scripts
 └── styles/                Global styles + design tokens (colors, fonts)

 public/                    Static files served as-is (favicons, etc.)
 docs/                      Design-system reference documents


◄── DO NOT TOUCH ───────────────────────────────────────────────────►

 dist/                      Build output — regenerated every build

 astro.config.mjs           Framework config
 tsconfig.json              TypeScript config
 package.json               Project commands
```

---

## How to Update Images (most common task)

1. Put the new file in `src/assets/` (for photos used by the page sections) or `public/` (for favicons and plain files).
2. **Keep the exact same file name** as the one you are replacing (e.g. replace `waterfront-hero.png` with your new `waterfront-hero.png`).
   - Same name = no code changes needed.
   - Adding a brand-new image? Use a simple name: lowercase, no spaces.
3. Rebuild and deploy (next section).

> **Supported formats:** `.webp` (best), `.png`, `.jpg`. Keep images a few hundred kB or less.

---

## How to Add Gallery Photos (no code required)

Gallery photos live in folders — one folder per category:

```
src/content/gallery/
├── landscaping/          ← "Landscaping"
├── seawalls/             ← "Seawalls"
├── retaining-walls/
├── patios/
├── beaches/
├── decks-boardwalks/     ← "Decks & Boardwalks"
├── dock-service-repairs/
└── hoist-service-repairs/
```

To add a photo (works on github.com, no coding):

1. Open the category folder on github.com (e.g. `src/content/gallery/landscaping`).
2. Click **Add file → Upload files** and drag the photo in.
3. Name it with a number so it appears in the right order: `01.webp`, `02.webp`, `03.webp`, … (or `01-shoreline-after.webp` — the filename after the number becomes the photo caption, e.g. "Shoreline after").
4. Click **Commit changes** to `main`. The site rebuilds automatically and the photo goes live in about a minute.

Rules that make this work:

- **Folder = category.** Photos appear in the gallery of the matching service page and on the `/gallery` page. A brand-new folder automatically becomes a new category (no code changes).
- **Filename = order.** Sort by the number prefix: `01-`, `02-`, `03-`…
- **Formats:** `.webp` (best), `.jpg`, `.png`. Keep photos a few hundred kB or less.
- Deleting a photo from the folder removes it from the site on the next build.

---

## How to Edit Text (headings, reviews, contact details)

- Most text lives in **`src/data/*.ts`** — plain files, easy to read and change.
  - Reviews → `src/data/reviews.ts`
  - Areas served → `src/data/serviceAreas.ts`
  - Site info (name, phone, links) → `src/data/site.ts`
- Text baked into a section's layout lives in the matching file under `src/components/`.
- Save the file, then rebuild and deploy.

---

## Run Locally (Developer)

Requirements: [Node.js](https://nodejs.org) (version 22 or newer).

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:4321** — the page live-reloads as you edit.

| Command | What it does |
| --- | --- |
| `npm install` | Installs dependencies (run once after cloning) |
| `npm run dev` | Local dev server at localhost:4321 (live reload) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Astro CLI help |

---

## Deploy (Publish the Site)

The site is connected to a hosting provider (Vercel) via the GitHub repository.

1. Edit files in `src/` or `public/`.
2. Commit and push to `main`.
3. The hosting provider builds (`npm run build`) and publishes the `dist/` folder automatically.

```
 Edit src/ or public/  →  Commit + push to main  →  Auto build & deploy  →  Live site
```

> **Quote form note:** the quote form (`src/components/pages/home/hero/QuoteForm.astro`) submits to an `/api/quote` endpoint that is not defined in this repository — it must be provided by the hosting platform. If quote submissions stop working, check that endpoint with your developer/hosting provider.

---

## Environment Variables

Any secret keys (form emails, APIs) are set in the hosting provider's dashboard under **Settings → Environment Variables** — never in the code.
