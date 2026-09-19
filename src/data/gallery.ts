import type { ImageMetadata } from "astro";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * gallery.ts - folder-driven gallery with parent category mapping and automatic deduplication.
 *
 * Every image inside `src/content/gallery/<category>/` is discovered at build
 * time. The folder name becomes the category, the filename prefix (01-, 02-…)
 * becomes the display order.
 *
 * Product pages load specific categories (e.g. `sectional-docks`, `canopies`).
 * The main /gallery page displays the canonical 8 tabs (Docks, Lifts, Seawalls, etc.)
 * aggregating subcategories as needed, with zero duplicate photos across tabs.
 */

export interface GalleryImage {
  src: ImageMetadata;
  fullSrc: string;
  alt: string;
  category: string;
  parentCategory?: string;
  allCategories?: string[];
}

export interface GalleryCategory {
  slug: string;
  label: string;
  count: number;
}

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../content/gallery/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" }
);

export const PARENT_CATEGORY_MAP: Record<string, string> = {
  "sectional-docks": "docks",
  "premium-stationary-docks": "docks",
  "roll-in-docks": "docks",
  "platinum-docks": "docks",
  "floating-dock": "docks",
  "starr-floating-dock": "docks",
  "dock-accessories": "docks",

  "boat-lifts": "lifts",
  "pwc-jetski-lifts": "lifts",
  "canopies": "lifts",
  "lift-accessories": "lifts",
};

/** Aliases for services that display parent or combined galleries */
export const CATEGORY_ALIASES: Record<string, string> = {
  "dock-service-repairs": "docks",
  "hoist-service-repairs": "lifts",
};

/** Nicer display names for categories and product page gallery headers. */
export const CATEGORY_LABEL_OVERRIDES: Record<string, string> = {
  "docks": "Docks",
  "lifts": "Lifts",
  "sectional-docks": "Sectional Docks",
  "premium-stationary-docks": "Premium Stationary Docks",
  "roll-in-docks": "Roll-In Docks",
  "platinum-docks": "Platinum Docks",
  "floating-dock": "Connect-A-Dock Floating Docks",
  "starr-floating-dock": "Starr Floating Docks",
  "dock-accessories": "Dock Accessories",
  "dock-service-repairs": "Dock Service & Repairs",
  "boat-lifts": "Boat & Pontoon Lifts",
  "pwc-jetski-lifts": "PWC / Jet Ski Lifts",
  "canopies": "Canopies & Covers",
  "lift-accessories": "Lift Accessories",
  "hoist-service-repairs": "Hoist Service & Repairs",
  "decks-boardwalks": "Decks & Boardwalks",
  "retaining-walls": "Retaining Walls",
  "patios": "Patios",
  "beaches": "Beaches",
  "seawalls": "Seawalls",
  "landscaping": "Landscaping",
};

/** Canonical category tabs for the /gallery page as defined in docs/edits.md. */
export const CANONICAL_GALLERY_TABS: { slug: string; label: string }[] = [
  { slug: "docks", label: "Docks" },
  { slug: "lifts", label: "Lifts" },
  { slug: "seawalls", label: "Seawalls" },
  { slug: "retaining-walls", label: "Retaining Walls" },
  { slug: "decks-boardwalks", label: "Decks & Boardwalks" },
  { slug: "beaches", label: "Beaches" },
  { slug: "patios", label: "Patios" },
  { slug: "landscaping", label: "Landscaping" },
];

/** Visual duplicates across folders (re-encoded photos or cross-category equivalents) */
const VISUAL_EQUIVALENCES: [string, string][] = [
  // Starr floating dock re-encoded copies of Connect-A-Dock floating docks
  ["starr-floating-dock/05.webp", "floating-dock/01.webp"],
  ["starr-floating-dock/06.webp", "floating-dock/02.webp"],
  ["starr-floating-dock/07.webp", "floating-dock/03.webp"],
  ["starr-floating-dock/08.webp", "floating-dock/04.webp"],
  ["starr-floating-dock/09.webp", "floating-dock/05.webp"],
  ["starr-floating-dock/10.webp", "floating-dock/06.webp"],
  ["starr-floating-dock/11.webp", "floating-dock/07.webp"],
  ["starr-floating-dock/12.webp", "floating-dock/08.webp"],
  ["starr-floating-dock/13.webp", "floating-dock/09.webp"],

  // Premium stationary docks vs Sectional docks
  ["premium-stationary-docks/02.webp", "sectional-docks/15.webp"],
  ["premium-stationary-docks/03.webp", "sectional-docks/03.webp"],
  ["premium-stationary-docks/04.webp", "sectional-docks/17.webp"],
  ["premium-stationary-docks/05.webp", "sectional-docks/10.webp"],
  ["premium-stationary-docks/06.webp", "sectional-docks/16.webp"],
  ["premium-stationary-docks/07.webp", "sectional-docks/01.webp"],

  // Cross-category visual matches
  ["patios/03.webp", "seawalls/08.webp"],
  ["retaining-walls/22.webp", "seawalls/25.webp"],
  ["retaining-walls/23.webp", "seawalls/26.webp"],
];

export function humanize(slug: string): string {
  const override = CATEGORY_LABEL_OVERRIDES[slug];
  if (override) return override;
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function humanizeAlt(filename: string, categoryLabel: string): string {
  const base = filename.replace(/\.(jpe?g|png|webp|avif)$/i, "");
  const readable = base.replace(/^\d+[-_.\s]*/, "").replace(/[-_]+/g, " ").trim();
  if (!readable) return "";
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

function sortOrder(filename: string): number {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

// ── Image Deduplication & Canonical Mapping ─────────────────────────────────
// Map each image file path to its canonical identifier based on SHA256 and visual equivalences.
const fileToCanonical = new Map<string, string>();
const shaToCanonical = new Map<string, string>();

for (const filePath of Object.keys(imageModules)) {
  const segments = filePath.split("/");
  const category = segments[segments.length - 2];
  const filename = segments[segments.length - 1];
  const rel = `${category}/${filename}`;

  try {
    const absPath = path.resolve(process.cwd(), "src", filePath.replace(/^\.\.\//, ""));
    const buf = fs.readFileSync(absPath);
    const sha = crypto.createHash("sha256").update(buf).digest("hex");

    if (!shaToCanonical.has(sha)) {
      shaToCanonical.set(sha, rel);
    }
    fileToCanonical.set(rel, shaToCanonical.get(sha)!);
  } catch {
    fileToCanonical.set(rel, rel);
  }
}

// Apply visual equivalences
for (const [dup, target] of VISUAL_EQUIVALENCES) {
  const canonicalTarget = fileToCanonical.get(target) || target;
  fileToCanonical.set(dup, canonicalTarget);
}

// Map canonical key -> all categories referencing it
const canonicalToCategories = new Map<string, Set<string>>();

for (const filePath of Object.keys(imageModules)) {
  const segments = filePath.split("/");
  const category = segments[segments.length - 2];
  const filename = segments[segments.length - 1];
  const rel = `${category}/${filename}`;
  const canonical = fileToCanonical.get(rel) || rel;

  if (!canonicalToCategories.has(canonical)) {
    canonicalToCategories.set(canonical, new Set());
  }
  canonicalToCategories.get(canonical)!.add(category);
}

const discoveredCategories = new Map<string, { label: string; files: { path: string; filename: string }[] }>();

for (const [path] of Object.entries(imageModules)) {
  const segments = path.split("/");
  const category = segments[segments.length - 2];
  const filename = segments[segments.length - 1];

  if (!discoveredCategories.has(category)) {
    discoveredCategories.set(category, { label: humanize(category), files: [] });
  }
  discoveredCategories.get(category)!.files.push({ path, filename });
}

export function getGalleryCategories(): GalleryCategory[] {
  return CANONICAL_GALLERY_TABS.map((tab) => {
    const uniqueCanonicals = new Set<string>();
    for (const [filePath] of Object.entries(imageModules)) {
      const segments = filePath.split("/");
      const category = segments[segments.length - 2];
      const filename = segments[segments.length - 1];
      const rel = `${category}/${filename}`;
      const canonical = fileToCanonical.get(rel) || rel;
      const parent = PARENT_CATEGORY_MAP[category];
      const cats = canonicalToCategories.get(canonical);

      if (tab.slug === "docks" || tab.slug === "lifts") {
        if (category === tab.slug || parent === tab.slug) {
          uniqueCanonicals.add(canonical);
        }
      } else {
        if (category === tab.slug || cats?.has(tab.slug)) {
          uniqueCanonicals.add(canonical);
        }
      }
    }
    return {
      slug: tab.slug,
      label: tab.label,
      count: uniqueCanonicals.size,
    };
  });
}

export function getGalleryImages(category?: string): GalleryImage[] {
  const resolvedCategory = category && CATEGORY_ALIASES[category] ? CATEGORY_ALIASES[category] : category;

  let targetSlugs: string[] = [];

  if (resolvedCategory) {
    if (resolvedCategory === "docks" || resolvedCategory === "lifts") {
      targetSlugs = [...discoveredCategories.keys()].filter(
        (slug) => slug === resolvedCategory || PARENT_CATEGORY_MAP[slug] === resolvedCategory
      );
    } else if (discoveredCategories.has(resolvedCategory)) {
      targetSlugs = [resolvedCategory];
    } else {
      targetSlugs = [];
    }
  } else {
    // Return all images in canonical tab order
    const ordered: string[] = [];
    for (const tab of CANONICAL_GALLERY_TABS) {
      if (tab.slug === "docks" || tab.slug === "lifts") {
        for (const slug of discoveredCategories.keys()) {
          if ((slug === tab.slug || PARENT_CATEGORY_MAP[slug] === tab.slug) && !ordered.includes(slug)) {
            ordered.push(slug);
          }
        }
      } else if (discoveredCategories.has(tab.slug) && !ordered.includes(tab.slug)) {
        ordered.push(tab.slug);
      }
    }
    for (const slug of discoveredCategories.keys()) {
      if (!ordered.includes(slug)) ordered.push(slug);
    }
    targetSlugs = ordered;
  }

  const result: GalleryImage[] = [];
  const seenCanonicals = new Set<string>();

  for (const slug of targetSlugs) {
    const entry = discoveredCategories.get(slug);
    if (!entry) continue;

    const sorted = [...entry.files].sort(
      (a, b) => sortOrder(a.filename) - sortOrder(b.filename) || a.filename.localeCompare(b.filename)
    );

    sorted.forEach((file, index) => {
      const rel = `${slug}/${file.filename}`;
      const canonical = fileToCanonical.get(rel) || rel;
      if (seenCanonicals.has(canonical)) {
        return; // Deduplicate identical or equivalent images across folders
      }
      seenCanonicals.add(canonical);

      const meta = imageModules[file.path];
      const readable = humanizeAlt(file.filename, entry.label);
      const alt = readable || `${entry.label} photo ${index + 1}`;
      const allCats = Array.from(canonicalToCategories.get(canonical) || [slug]);

      result.push({
        src: meta,
        fullSrc: meta.src,
        alt,
        category: slug,
        parentCategory: PARENT_CATEGORY_MAP[slug],
        allCategories: allCats,
      });
    });
  }

  return result;
}
