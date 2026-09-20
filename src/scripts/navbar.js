(() => {
  const header = document.querySelector("[data-navbar]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menuPanel = document.querySelector("[data-menu-panel]");

  if (!header || !menuButton || !menuPanel) return;

  const SCROLL_THRESHOLD = 12;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const resetAccordions = () => {
    menuPanel.querySelectorAll("[data-accordion-btn]").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
    });
    menuPanel.querySelectorAll(".mobile-accordion-panel").forEach((panel) => {
      panel.classList.remove("is-open");
    });
  };

  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) {
      setTimeout(resetAccordions, 300);
    }
  };

  menuButton.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  menuPanel.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-accordion-btn]");
    if (trigger) {
      event.preventDefault();
      event.stopPropagation();

      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const targetId = trigger.getAttribute("aria-controls");
      const targetPanel = targetId ? document.getElementById(targetId) : null;
      if (!targetPanel) return;

      const parentList = trigger.closest("[data-accordion-group]");
      if (!isExpanded && parentList) {
        // Close siblings within the same parent list level to keep menu clean and compact
        const siblingButtons = parentList.querySelectorAll(":scope > li > [data-accordion-btn]");
        siblingButtons.forEach((siblingBtn) => {
          if (siblingBtn !== trigger && siblingBtn.getAttribute("aria-expanded") === "true") {
            siblingBtn.setAttribute("aria-expanded", "false");
            const sibId = siblingBtn.getAttribute("aria-controls");
            const sibPanel = sibId ? document.getElementById(sibId) : null;
            if (sibPanel) {
              sibPanel.classList.remove("is-open");
            }
          }
        });
      }

      trigger.setAttribute("aria-expanded", String(!isExpanded));
      targetPanel.classList.toggle("is-open", !isExpanded);
      return;
    }

    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) setOpen(false);
  });
})();
