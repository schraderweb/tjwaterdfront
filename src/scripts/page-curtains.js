(() => {
  // Page-curtain navigation transition — "Rising Tide".
  //
  // Works alongside Astro's <ClientRouter />: a navy "water" curtain sweeps
  // across the viewport with layered brand waves rolling at the crest, the
  // target page name is announced inside a full brand lockup (eyebrow, anchor,
  // T&J wordmark, gold rule), then the curtain sweeps away to reveal the new
  // page. The wipe direction reverses on back/forward ("traverse") navigation.
  // Astro's default root transition is disabled (transition:animate="none")
  // so the snapshot swap stays hidden behind the curtain.

  if (window.__pageCurtainsInit) return;
  window.__pageCurtainsInit = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const COVER_MS = 380;
  const LOCKUP_STEP_MS = 130;
  const LOCKUP_STAGGER_MS = 55;
  const HOLD_MS = 500;
  const LOCKUP_OUT_MS = 140;
  const REVEAL_MS = 480;

  const EASE_COVER = "cubic-bezier(0.83, 0, 0.17, 1)";
  const EASE_REVEAL = "cubic-bezier(0.22, 1, 0.36, 1)";
  const EASE_SETTLE = "cubic-bezier(0.33, 1, 0.68, 1)";

  const CREST_THICKNESS = 6;

  const SVG_NS = "http://www.w3.org/2000/svg";

  const ANCHOR_HTML =
    '<circle cx="12" cy="5.5" r="2.25"/>' +
    '<path d="M12 7.75V20M5 12.5H3.5a8.5 8.5 0 0 0 17 0H19M12 20a4.25 4.25 0 0 0-4.25-4.25h8.5A4.25 4.25 0 0 0 12 20Z"/>';

  const WAVE_HTML =
    '<path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"/>' +
    '<path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"/>' +
    '<path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"/>';

  const WAVE_SETTLE = [46, 30, 14];
  const WAVE_BOB = [5, 4, 3];

  let root = null;
  let panel = null;
  let crestEl = null;
  let waves = [];
  let lockupItems = [];
  let heroEl = null;
  let activeAnimations = [];
  let running = false;
  let runId = 0;
  let oldTitle = "";
  let fallbackTitle = "";

  const makeSvg = (html) => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 1200 120");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = html;
    return svg;
  };

  const span = (className, text = "") => {
    const el = document.createElement("span");
    el.className = className;
    el.textContent = text;
    return el;
  };

  const build = () => {
    root = document.createElement("div");
    root.className = "page-curtains";
    root.setAttribute("aria-hidden", "true");

    panel = document.createElement("div");
    panel.className = "page-curtains__panel";
    waves = [0, 1, 2].map((i) => {
      const svg = makeSvg(WAVE_HTML);
      svg.classList.add("page-curtains__wave", `page-curtains__wave--${i + 1}`);
      return svg;
    });
    crestEl = span("page-curtains__crest");
    panel.append(...waves, crestEl);

    const lockup = document.createElement("div");
    lockup.className = "page-curtains__lockup";

    const anchor = makeSvg(ANCHOR_HTML);
    anchor.setAttribute("viewBox", "0 0 24 24");
    anchor.setAttribute("fill", "none");
    anchor.setAttribute("stroke", "currentColor");
    anchor.setAttribute("stroke-width", "1.5");
    anchor.setAttribute("stroke-linecap", "round");
    anchor.setAttribute("stroke-linejoin", "round");
    anchor.classList.add("page-curtains__anchor");

    heroEl = span("page-curtains__hero");

    lockupItems = [
      anchor,
      heroEl,
      span("page-curtains__rule"),
      span("page-curtains__brand", "T&J Waterfront Services"),
    ];
    lockup.append(...lockupItems);

    root.append(panel, lockup);
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
    const id = ++runId;
    running = true;
    cancelAll();

    const travel = `${window.innerHeight * 1.3}px`;
    const coverFrom = backward ? `-${travel}` : travel;
    const revealTo = backward ? travel : `-${travel}`;

    // Straight vertical edges — no slant.
    panel.style.clipPath = "none";
    crestEl.style.clipPath = `polygon(0 0, 100% 0, 100% ${CREST_THICKNESS}px, 0 ${CREST_THICKNESS}px)`;

    root.classList.add("is-active");
    panel.style.transform = "translateY(0px)";
    lockupItems.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
    });
    waves.forEach((w, i) => {
      w.style.transform = `translateY(${WAVE_SETTLE[i]}px)`;
    });

    track(
      panel.animate(
        [{ transform: `translateY(${coverFrom})` }, { transform: "translateY(0px)" }],
        { duration: COVER_MS, easing: EASE_COVER, fill: "forwards" }
      )
    );
    waves.forEach((w, i) => {
      track(
        w.animate(
          [
            { transform: `translateY(${WAVE_SETTLE[i]}px)` },
            { transform: "translateY(0px)" },
          ],
          {
            duration: COVER_MS + 140 + i * 70,
            easing: EASE_SETTLE,
            fill: "forwards",
          }
        )
      );
    });

    await wait(COVER_MS);
    if (id !== runId) return;

    const bobs = waves.map((w, i) =>
      track(
        w.animate(
          [
            { transform: "translateY(0px)" },
            { transform: `translateY(-${WAVE_BOB[i]}px)` },
            { transform: "translateY(0px)" },
          ],
          { duration: 1600 + i * 220, iterations: Infinity, easing: "ease-in-out" }
        )
      )
    );

    heroEl.textContent = pageName();
    lockupItems.forEach((el, i) => {
      track(
        el.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0px)" },
          ],
          {
            duration: LOCKUP_STEP_MS,
            delay: i * LOCKUP_STAGGER_MS,
            easing: "ease-out",
            fill: "forwards",
          }
        )
      );
    });

    const lockupTotal = lockupItems.length * LOCKUP_STAGGER_MS + LOCKUP_STEP_MS;
    await wait(lockupTotal + HOLD_MS);
    if (id !== runId) return;

    bobs.forEach((anim) => anim.cancel());

    lockupItems.forEach((el) => {
      track(
        el.animate(
          [{ opacity: 1 }, { opacity: 0, transform: "translateY(-10px)" }],
          { duration: LOCKUP_OUT_MS, easing: "ease-in", fill: "forwards" }
        )
      );
    });
    await wait(LOCKUP_OUT_MS);
    if (id !== runId) return;

    waves.forEach((w) => {
      track(
        w.animate(
          [{ transform: "translateY(0px)" }, { transform: "translateY(-48px)" }],
          { duration: REVEAL_MS, easing: EASE_REVEAL, fill: "forwards" }
        )
      );
    });
    track(
      panel.animate(
        [{ transform: "translateY(0px)" }, { transform: `translateY(${revealTo})` }],
        { duration: REVEAL_MS, easing: EASE_REVEAL, fill: "forwards" }
      )
    );
    await wait(REVEAL_MS);

    if (id === runId) {
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
    run(backward);
  });
})();
