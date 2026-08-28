/**
 * submit-success.js — GSAP-driven thank-you transition for forms marked
 * [data-submit-success]. On a valid submit it collapses the form (plus any
 * [data-success-hide] siblings inside the [data-success-root]), reveals the
 * [data-success-panel], plays the SVG scene (ring pop, wave drift, boat bob,
 * checkmark draw), and supports a "send another" reset button.
 * Reduced-motion users get an instant, static success state.
 */
import gsap from "gsap";

export function initSubmitSuccess() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("form[data-submit-success]").forEach((form) => {
    const root = form.closest("[data-success-root]");
    if (!root) return;

    const panel = root.querySelector("[data-success-panel]");
    if (!panel) return;

    const resetButton = root.querySelector("[data-success-reset]");
    const hideables = Array.from(root.querySelectorAll("[data-success-hide]"));
    const firstField = form.querySelector('input:not(.sr-only), select, textarea');
    const errorMessage = root.querySelector("[data-submit-error]");
    const submitButton = form.querySelector('[type="submit"]');

    let state = "idle";
    let ambient = null;

    const captureScene = () => ({
      ring: panel.querySelector("[data-success-ring]"),
      waves: Array.from(panel.querySelectorAll("[data-success-wave]")),
      boat: panel.querySelector("[data-success-boat]"),
      check: panel.querySelector("[data-success-check]"),
      checkLength: panel.querySelector("[data-success-check]")?.getTotalLength() ?? 0,
    });

    const focusSuccessPanel = () => {
      panel.focus({ preventScroll: true });
      const { top, bottom } = panel.getBoundingClientRect();
      const viewportPadding = 24;
      if (top < viewportPadding || bottom > window.innerHeight - viewportPadding) {
        panel.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    };

    const playScene = (scene) => {
      gsap.set(scene.ring, { transformOrigin: "50% 50%", scale: 0.85, autoAlpha: 0 });
      gsap.set(scene.waves, { autoAlpha: 0 });
      gsap.set(scene.boat, { transformOrigin: "50% 50%", autoAlpha: 0 });
      gsap.set(scene.check, {
        transformOrigin: "50% 50%",
        strokeDasharray: scene.checkLength,
        strokeDashoffset: scene.checkLength,
        autoAlpha: 0,
      });

      const timeline = gsap.timeline();
      timeline
        .to(scene.ring, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0)
        .to(scene.waves, { autoAlpha: 1, duration: 0.4, stagger: 0.12, ease: "power2.out" }, 0.35)
        .to(scene.boat, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.55)
        .to(scene.check, { autoAlpha: 1, duration: 0.15 }, 0.85)
        .to(scene.check, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 0.9);

      timeline.eventCallback("onComplete", () => {
        ambient = gsap.timeline();
        scene.waves.forEach((wave, i) => {
          ambient.to(
            wave,
            {
              y: i % 2 === 0 ? -1.25 : 1.25,
              duration: 2.4 + i * 0.35,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            },
            i * 0.35
          );
        });
        ambient.to(
          scene.boat,
          {
            y: -2.5,
            rotate: 1.5,
            duration: 1.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
          0
        );
      });
    };

    const showSuccess = () => {
      if (state !== "idle") return;
      state = "transitioning";
      ambient?.kill();

      const scene = captureScene();
      gsap.set(panel, { transformOrigin: "50% 50%", autoAlpha: 0, y: 24, scale: 0.97 });

      if (reducedMotion) {
        form.hidden = true;
        hideables.forEach((el) => (el.hidden = true));
        panel.hidden = false;
        focusSuccessPanel();
        state = "success";
        return;
      }

      gsap
        .timeline()
        .to([form, ...hideables], {
          autoAlpha: 0,
          y: -14,
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.in",
          onComplete: () => {
            form.hidden = true;
            hideables.forEach((el) => (el.hidden = true));
            panel.hidden = false;
          },
        })
        .to(panel, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            state = "success";
            focusSuccessPanel();
            playScene(scene);
          },
        });
    };

    const resetForm = () => {
      if (state !== "success") return;
      state = "resetting";
      ambient?.kill();

      const restore = () => {
        panel.hidden = true;
        form.hidden = false;
        hideables.forEach((el) => (el.hidden = false));
        form.reset();
        state = "idle";
        if (reducedMotion) {
          firstField?.focus();
          return;
        }
        gsap.fromTo(
          form,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => firstField?.focus(),
          }
        );
      };

      if (reducedMotion) {
        restore();
        return;
      }

      gsap.to(panel, {
        autoAlpha: 0,
        y: 16,
        duration: 0.3,
        ease: "power2.in",
        onComplete: restore,
      });
    };

    const showError = (text) => {
      if (!errorMessage) return;
      errorMessage.textContent = text || "Something went wrong. Please try again.";
      errorMessage.hidden = false;
    };

    const clearError = () => {
      if (!errorMessage) return;
      errorMessage.hidden = true;
      errorMessage.textContent = "";
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      clearError();

      const originalLabel = submitButton?.textContent ?? "";
      submitButton?.setAttribute("disabled", "");
      if (submitButton) submitButton.textContent = "Sending…";

      try {
        const body = new FormData(form);
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(body.entries())),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.ok !== true) {
          throw new Error(data.error || "Could not save your request.");
        }
        showSuccess();
      } catch (err) {
        showError(err.message);
        submitButton?.removeAttribute("disabled");
        if (submitButton) submitButton.textContent = originalLabel;
      }
    });

    resetButton?.addEventListener("click", resetForm);
  });
}
