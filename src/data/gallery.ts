import type { ImageMetadata } from "astro";

/**
 * gallery.ts — the folder-driven gallery.
 *
 * Every image inside `src/content/gallery/<category>/` is discovered at build
 * time. The folder name becomes the category, the filename prefix (01-, 02-…)
 * becomes the display order. Drop a photo into a folder → it appears on the
 * site after the next build. No code changes required.
 */

export type GallerySize = "small" | "medium" | "large" | "tall" | "wide";

export interface GalleryImage {
  src: ImageMetadata;
  fullSrc: string;
  alt: string;
  category: string;
  categoryLabel: string;
  size: GallerySize;
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

/** Nicer display names for category folders (folder names can't contain "&"). */
const CATEGORY_LABEL_OVERRIDES: Record<string, string> = {
  "decks-boardwalks": "Decks & Boardwalks",
  "dock-service-repairs": "Dock Service & Repairs",
  "hoist-service-repairs": "Hoist Service & Repairs",
};

/** Canonical category order for the /gallery tabs. New folders append after these. */
const DEFAULT_CATEGORY_ORDER = [
  "landscaping",
  "seawalls",
  "retaining-walls",
  "patios",
  "beaches",
  "decks-boardwalks",
  "dock-service-repairs",
  "hoist-service-repairs",
];

/** Mosaic rhythm cycled across each category (matches the original gallery look). */
const SIZE_CYCLE: GallerySize[] = ["large", "tall", "wide", "medium", "small", "medium"];

function humanize(slug: string): string {
  const override = CATEGORY_LABEL_OVERRIDES[slug];
  if (override) return override;
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function humanizeAlt(filename: string): string {
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

for (const [path, image] of Object.entries(imageModules)) {
  const segments = path.split("/");
  const category = segments[segments.length - 2];
  const filename = segments[segments.length - 1];

  if (!discoveredCategories.has(category)) {
    discoveredCategories.set(category, { label: humanize(category), files: [] });
  }
  discoveredCategories.get(category)!.files.push({ path, filename });
}

const orderedSlugs = [
  ...DEFAULT_CATEGORY_ORDER,
  ...[...discoveredCategories.keys()].filter((slug) => !DEFAULT_CATEGORY_ORDER.includes(slug)),
];

export function getGalleryCategories(): GalleryCategory[] {
  return orderedSlugs.map((slug) => {
    const entry = discoveredCategories.get(slug);
    return {
      slug,
      label: entry?.label ?? humanize(slug),
      count: entry?.files.length ?? 0,
    };
  });
}

export function getGalleryImages(category?: string): GalleryImage[] {
  const slugs = category ? [category] : orderedSlugs;
  const result: GalleryImage[] = [];

  for (const slug of slugs) {
    const entry = discoveredCategories.get(slug);
    if (!entry) continue;

    const sorted = [...entry.files].sort(
      (a, b) => sortOrder(a.filename) - sortOrder(b.filename) || a.filename.localeCompare(b.filename)
    );

    sorted.forEach((file, index) => {
      const meta = imageModules[file.path];
      const readable = humanizeAlt(file.filename);
      const alt = readable || `${entry.label} photo ${index + 1}`;
      result.push({
        src: meta,
        fullSrc: meta.src,
        alt,
        category: slug,
        categoryLabel: entry.label,
        size: SIZE_CYCLE[index % SIZE_CYCLE.length],
      });
    });
  }

  return result;
}
