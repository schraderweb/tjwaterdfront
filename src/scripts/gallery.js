/**
 * gallery.js — powers the gallery grid: category tabs + lightbox.
 *
 * Lightbox controls:
 *  - X button (top-right) closes
 *  - left/right arrow buttons navigate
 *  - mouse wheel scrolls through photos (throttled)
 *  - keyboard: Esc closes, ArrowLeft/ArrowRight navigate
 *  - clicking the dimmed backdrop closes
 */
const WHEEL_THROTTLE_MS = 350;

function initGallery(root) {
  const grid = root.querySelector("[data-gallery-grid]");
  const lightbox = root.querySelector("[data-lightbox]");
  const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
  const lightboxCounter = lightbox?.querySelector("[data-lightbox-counter]");
  const emptyState = root.querySelector("[data-gallery-empty]");
  const tabButtons = root.querySelectorAll("[data-gallery-tab]");

  let currentIndex = 0;
  let lastTrigger = null;
  let wheelLock = false;

  const getVisibleItems = () =>
    [...grid.querySelectorAll("[data-gallery-item]")].filter((item) => !item.classList.contains("is-hidden"));

  function showImage(index) {
    const items = getVisibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];

    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.dataset.caption || "";
    lightboxCaption.textContent = item.dataset.caption || "";
    lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;

    const neighbor = (offset) => {
      const next = items[(currentIndex + offset + items.length) % items.length];
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

  // Category tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.galleryTab;

      tabButtons.forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      let visibleCount = 0;
      grid.querySelectorAll("[data-gallery-item]").forEach((item) => {
        const show = category === "all" || item.dataset.category === category;
        item.classList.toggle("is-hidden", !show);
        if (show) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount > 0;
      closeLightbox();
    });
  });
}

document.querySelectorAll("[data-gallery]").forEach(initGallery);
