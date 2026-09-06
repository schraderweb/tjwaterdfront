import type { ImageMetadata } from "astro";

/**
 * gallery.ts — folder-driven gallery with parent category mapping.
 *
 * Every image inside `src/content/gallery/<category>/` is discovered at build
 * time. The folder name becomes the category, the filename prefix (01-, 02-…)
 * becomes the display order.
 *
 * Product pages load specific categories (e.g. `sectional-docks`, `canopies`).
 * The main /gallery page displays the canonical 8 tabs (Docks, Lifts, Seawalls, etc.)
 * aggregating subcategories as needed.
 */

export interface GalleryImage {
  src: ImageMetadata;
  fullSrc: string;
  alt: string;
  category: string;
  parentCategory?: string;
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
  "roll-in-docks": "docks",
  "platinum-docks": "docks",
  "floating-dock": "docks",
  "starr-floating-dock": "docks",
  "dock-accessories": "docks",
  "dock-service-repairs": "docks",

  "boat-lifts": "lifts",
  "pwc-jetski-lifts": "lifts",
  "canopies": "lifts",
  "lift-accessories": "lifts",
  "hoist-service-repairs": "lifts",
};

/** Nicer display names for categories and product page gallery headers. */
export const CATEGORY_LABEL_OVERRIDES: Record<string, string> = {
  "docks": "Docks",
  "lifts": "Lifts",
  "sectional-docks": "Sectional Docks",
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
    let count = 0;
    if (tab.slug === "docks" || tab.slug === "lifts") {
      for (const [slug, entry] of discoveredCategories.entries()) {
        if (slug === tab.slug || PARENT_CATEGORY_MAP[slug] === tab.slug) {
          count += entry.files.length;
        }
      }
    } else {
      count = discoveredCategories.get(tab.slug)?.files.length ?? 0;
    }
    return {
      slug: tab.slug,
      label: tab.label,
      count,
    };
  });
}

export function getGalleryImages(category?: string): GalleryImage[] {
  let targetSlugs: string[] = [];

  if (category) {
    if (category === "docks" || category === "lifts") {
      targetSlugs = [...discoveredCategories.keys()].filter(
        (slug) => slug === category || PARENT_CATEGORY_MAP[slug] === category
      );
    } else if (discoveredCategories.has(category)) {
      targetSlugs = [category];
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

  for (const slug of targetSlugs) {
    const entry = discoveredCategories.get(slug);
    if (!entry) continue;

    const sorted = [...entry.files].sort(
      (a, b) => sortOrder(a.filename) - sortOrder(b.filename) || a.filename.localeCompare(b.filename)
    );

    sorted.forEach((file, index) => {
      const meta = imageModules[file.path];
      const readable = humanizeAlt(file.filename, entry.label);
      const alt = readable || `${entry.label} photo ${index + 1}`;
      result.push({
        src: meta,
        fullSrc: meta.src,
        alt,
        category: slug,
        parentCategory: PARENT_CATEGORY_MAP[slug],
      });
    });
  }

  return result;
}
