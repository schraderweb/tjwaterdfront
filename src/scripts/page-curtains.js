(() => {
  // Page-curtain navigation transition.
  //
  // Works alongside Astro's <ClientRouter />: a real-DOM navy curtain sweeps
  // across the viewport, the target page name fades in on the fully covered
  // curtain, then the curtain sweeps away to reveal the swapped page.
  // The wipe direction reverses on back/forward ("traverse") navigation.
  // Astro's default root transition is disabled (transition:animate="none")
  // so the snapshot swap stays hidden behind the curtain.

  if (window.__pageCurtainsInit) return;
  window.__pageCurtainsInit = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const COVER_MS = 380;
  const TITLE_IN_MS = 150;
  const TITLE_HOLD_MS = 380;
  const TITLE_OUT_MS = 140;
  const REVEAL_MS = 480;

  const EASE_COVER = "cubic-bezier(0.83, 0, 0.17, 1)";
  const EASE_REVEAL = "cubic-bezier(0.22, 1, 0.36, 1)";

  let root = null;
  let panel = null;
  let titleEl = null;
  let activeAnimations = [];
  let running = false;
  let oldTitle = "";
  let fallbackTitle = "";

  const build = () => {
    root = document.createElement("div");
    root.className = "page-curtains";
    root.setAttribute("aria-hidden", "true");
    panel = document.createElement("div");
    panel.className = "page-curtains__panel";
    titleEl = document.createElement("p");
    titleEl.className = "page-curtains__title";
    titleEl.setAttribute("aria-hidden", "true");
    root.append(panel, titleEl);
    document.documentElement.appendChild(root);
  };

  const cancelAll = () => {
    activeAnimations.forEach((anim) => anim.cancel());
    activeAnimations = [];
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const track = (anim) => {
    activeAnimations.push(anim);
    anim.finished
      .catch(() => {})
      .finally(() => {
        activeAnimations = activeAnimations.filter((a) => a !== anim);
      });
    return anim;
  };

  const pageName = () => {
    const current = document.title.trim();
    if (current && current !== oldTitle) {
      const clean = current.split("|")[0].trim();
      return clean || current;
    }
    return fallbackTitle || "T&J Waterfront Services";
  };

  const run = async (backward) => {
    running = true;
    cancelAll();

    const travel = `${window.innerHeight * 1.3}px`;
    const coverFrom = backward ? `-${travel}` : travel;
    const revealTo = backward ? travel : `-${travel}`;

    root.classList.add("is-active");
    panel.style.transform = "translateY(0px)";
    titleEl.style.opacity = "0";
    titleEl.style.transform = "translateY(10px)";

    track(
      panel.animate(
        [{ transform: `translateY(${coverFrom})` }, { transform: "translateY(0px)" }],
        { duration: COVER_MS, easing: EASE_COVER, fill: "forwards" }
      )
    );
    await wait(COVER_MS);
    if (!running) return;

    titleEl.textContent = pageName();
    track(
      titleEl.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0px)" },
        ],
        { duration: TITLE_IN_MS, easing: "ease-out", fill: "forwards" }
      )
    );
    await wait(TITLE_IN_MS + TITLE_HOLD_MS);
    if (!running) return;

    track(
      titleEl.animate(
        [{ opacity: 1 }, { opacity: 0, transform: "translateY(-8px)" }],
        { duration: TITLE_OUT_MS, easing: "ease-in", fill: "forwards" }
      )
    );
    await wait(TITLE_OUT_MS);
    if (!running) return;

    track(
      panel.animate(
        [{ transform: "translateY(0px)" }, { transform: `translateY(${revealTo})` }],
        { duration: REVEAL_MS, easing: EASE_REVEAL, fill: "forwards" }
      )
    );
    await wait(REVEAL_MS);

    if (running) {
      root.classList.remove("is-active");
      panel.style.transform = "";
      running = false;
    }
  };

  document.addEventListener("astro:before-preparation", (event) => {
    if (!root) build();
    const backward = event.navigationType === "traverse";
    oldTitle = document.title;
    fallbackTitle =
      event.sourceElement?.getAttribute("data-curtain-title") ??
      event.sourceElement?.textContent?.trim() ??
      "";
    if (running) cancelAll();
    run(backward);
  });
})();
