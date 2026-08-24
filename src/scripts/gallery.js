/**
 * gallery.js — powers the gallery grid: category tabs, incremental "view more"
 * loading, and lightbox.
 *
 * The first batch of photos is server-rendered; the remainder is shipped as a
 * JSON manifest (`[data-gallery-manifest]`) and appended 20 at a time when the
 * "VIEW MORE PHOTOS" button is clicked, so images load in the background.
 *
 * Lightbox controls:
 *  - X button (top-right) closes
 *  - left/right arrow buttons navigate
 *  - mouse wheel scrolls through photos (throttled)
 *  - keyboard: Esc closes, ArrowLeft/ArrowRight navigate
 *  - clicking the dimmed backdrop closes
 */
const WHEEL_THROTTLE_MS = 350;
const BATCH_SIZE = 20;
const IMG_SIZES = "(max-width: 48rem) calc(50vw - 1.25rem), (max-width: 64rem) calc(33.33vw - 2rem), calc(25vw - 2.5rem)";

function initGallery(root) {
  const grid = root.querySelector("[data-gallery-grid]");
  const lightbox = root.querySelector("[data-lightbox]");
  const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
  const lightboxCounter = lightbox?.querySelector("[data-lightbox-counter]");
  const emptyState = root.querySelector("[data-gallery-empty]");
  const tabButtons = root.querySelectorAll("[data-gallery-tab]");
  const moreWrap = root.querySelector("[data-gallery-more]");
  const moreButton = moreWrap?.querySelector("[data-gallery-more-button]");
  const moreCount = moreWrap?.querySelector("[data-gallery-more-count]");

  let manifest = [];
  try {
    manifest = JSON.parse(root.querySelector("[data-gallery-manifest]")?.textContent || "[]");
  } catch {
    manifest = [];
  }

  let activeCategory = "all";
  let offset = 0;
  let currentIndex = 0;
  let lastTrigger = null;
  let wheelLock = false;

  const currentItems = () =>
    activeCategory === "all" ? manifest : manifest.filter((item) => item.category === activeCategory);

  const getVisibleItems = () =>
    [...grid.querySelectorAll("[data-gallery-item]")].filter((item) => !item.classList.contains("is-hidden"));

  function itemNode(data) {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.dataset.galleryItem = "";
    item.dataset.category = data.category;
    item.dataset.full = data.full;
    item.dataset.caption = data.alt;
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", `View ${data.alt}`);

    const picture = document.createElement("picture");
    if (data.avifSrcset) {
      const sourceAvif = document.createElement("source");
      sourceAvif.type = "image/avif";
      sourceAvif.srcset = data.avifSrcset;
      picture.append(sourceAvif);
    }
    if (data.webpSrcset) {
      const sourceWebp = document.createElement("source");
      sourceWebp.type = "image/webp";
      sourceWebp.srcset = data.webpSrcset;
      picture.append(sourceWebp);
    }

    const img = document.createElement("img");
    img.className = "gallery-image";
    img.alt = data.alt;
    img.loading = "lazy";
    img.width = data.width;
    img.height = data.height;
    img.sizes = IMG_SIZES;
    img.src = data.src;
    picture.append(img);
    item.append(picture);
    return item;
  }

  function renderBatch(start, end) {
    const fragment = document.createDocumentFragment();
    currentItems()
      .slice(start, end)
      .forEach((data) => fragment.append(itemNode(data)));
    grid.append(fragment);
  }

  function updateMore() {
    if (!moreWrap) return;
    const total = currentItems().length;
    const loaded = Math.min(offset, total);
    const hasMore = loaded < total;
    moreWrap.hidden = !hasMore;
    if (moreCount) moreCount.textContent = `Showing ${loaded} of ${total}`;
  }

  function resetGrid(category) {
    activeCategory = category;
    offset = BATCH_SIZE;
    grid.querySelectorAll("[data-gallery-item]").forEach((item) => item.remove());
    renderBatch(0, BATCH_SIZE);
    updateMore();
    if (emptyState) emptyState.hidden = currentItems().length > 0;
    closeLightbox();
  }

  function showImage(index) {
    const items = getVisibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];

    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.dataset.caption || "";
    lightboxCaption.textContent = item.dataset.caption || "";
    lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;

    const neighbor = (itemOffset) => {
      const next = items[(currentIndex + itemOffset + items.length) % items.length];
      if (next?.dataset.full) {
        const preload = new Image();
        preload.src = next.dataset.full;
      }
    };
    neighbor(1);
    neighbor(-1);
  }

  function openLightbox(item) {
    if (!lightbox) return;
    lastTrigger = item;
    document.body.style.overflow = "hidden";
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    showImage(getVisibleItems().indexOf(item));
    lightbox.querySelector("[data-lightbox-close]")?.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    const trigger = lastTrigger;
    lightbox.hidden = true;
    lastTrigger = null;
    trigger?.focus();
  }

  function step(direction) {
    if (lightbox.hidden) return;
    showImage(currentIndex + direction);
  }

  // Grid item click → open lightbox
  grid.addEventListener("click", (event) => {
    const item = event.target.closest("[data-gallery-item]");
    if (item) openLightbox(item);
  });
  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest("[data-gallery-item]");
    if (item) {
      event.preventDefault();
      openLightbox(item);
    }
  });

  // Lightbox controls
  lightbox.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => step(-1));
  lightbox.querySelector("[data-lightbox-next]")?.addEventListener("click", () => step(1));

  // Backdrop click closes (ignore clicks on the image/caption/controls)
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  // Mouse wheel navigates between photos
  lightbox.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      window.setTimeout(() => (wheelLock = false), WHEEL_THROTTLE_MS);
      if (event.deltaY > 0) step(1);
      else step(-1);
    },
    { passive: false }
  );

  // Keyboard
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    else if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
  });

  // Category tabs → rebuild grid with the category's first batch
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.galleryTab;

      tabButtons.forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      resetGrid(category);
    });
  });

  // "View more" → append the next batch
  moreButton?.addEventListener("click", () => {
    const total = currentItems().length;
    if (offset >= total) return;
    const next = Math.min(offset + BATCH_SIZE, total);
    renderBatch(offset, next);
    offset = next;
    updateMore();
  });

  // The first batch is already server-rendered
  offset = BATCH_SIZE;
  updateMore();
}

document.querySelectorAll("[data-gallery]").forEach(initGallery);
