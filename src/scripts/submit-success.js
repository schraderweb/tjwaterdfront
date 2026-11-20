/**
 * submit-success.js - GSAP-driven thank-you transition for forms marked
 * [data-submit-success]. On a valid submit it collapses the form (plus any
 * [data-success-hide] siblings inside the [data-success-root]), reveals the
 * [data-success-panel], plays the SVG scene (ring pop, wave drift, boat bob,
 * checkmark draw), and supports a "send another" reset button.
 * Reduced-motion users get an instant, static success state.
 * Submissions carry a Cloudflare Turnstile token (see createTurnstile below).
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

    const turnstile = createTurnstile(form);
    form.addEventListener("focusin", turnstile.warmUp, { once: true });

    const postQuote = async (token) => {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload["cf-turnstile-response"] = token;
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok && data.ok === true, data };
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (state !== "idle" || submitButton?.hasAttribute("disabled")) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      clearError();

      const originalLabel = submitButton?.innerHTML ?? "";
      const restoreButton = () => {
        submitButton?.removeAttribute("disabled");
        if (submitButton) submitButton.innerHTML = originalLabel;
      };
      submitButton?.setAttribute("disabled", "");
      if (submitButton) submitButton.textContent = "Sending…";

      try {
        let result = await postQuote(await turnstile.token());
        // Tokens are single-use and expire after 5 minutes: get a fresh one and retry once.
        if (result.data.code === "verification_expired") {
          turnstile.reset();
          result = await postQuote(await turnstile.token());
        }
        turnstile.reset();
        if (!result.ok) throw new Error(result.data.error || "Could not save your request.");
        restoreButton();
        showSuccess();
      } catch (err) {
        turnstile.reset();
        showError(err.message);
        restoreButton();
      }
    });

    resetButton?.addEventListener("click", resetForm);
  });
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let turnstileApi = null;

function loadTurnstile() {
  turnstileApi ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      turnstileApi = null;
      script.remove();
      reject(new Error("The verification check couldn't load. Please disable content blockers for this site, or call us."));
    };
    document.head.appendChild(script);
  });
  return turnstileApi;
}

/**
 * Cloudflare Turnstile (Managed mode, interaction-only appearance): loads on first
 * focus so the first paint stays script-free, runs invisibly, and only shows a
 * checkbox in [data-turnstile] when Cloudflare needs the visitor to click.
 */
function createTurnstile(form) {
  const slot = form.querySelector("[data-turnstile]");
  const siteKey = slot?.dataset.sitekey;
  let widget = null;
  let widgetId;
  let current = "";
  let waiters = [];

  const settle = (value) => {
    current = value;
    if (!value) return;
    waiters.forEach((resolve) => resolve(value));
    waiters = [];
  };

  const ensureWidget = () => {
    if (!siteKey) return Promise.resolve();
    widget ??= loadTurnstile()
      .then((api) => {
        widgetId = api.render(slot, {
          sitekey: siteKey,
          action: "quote",
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: settle,
          "expired-callback": () => settle(""),
          "error-callback": () => {
            settle("");
            slot.classList.add("is-visible");
          },
          "before-interactive-callback": () => slot.classList.add("is-visible"),
          "after-interactive-callback": () => slot.classList.remove("is-visible"),
        });
      })
      .catch((err) => {
        widget = null;
        throw err;
      });
    return widget;
  };

  return {
    warmUp: () => ensureWidget().catch(() => {}),
    async token() {
      await ensureWidget();
      if (!siteKey || current) return current;
      // Wait for the invisible check, or for the visitor to finish an interactive one.
      const token = await new Promise((resolve) => {
        waiters.push(resolve);
        setTimeout(() => resolve(""), 60_000);
      });
      if (!token) throw new Error("Please complete the verification check, then send your request again.");
      return token;
    },
    reset() {
      settle("");
      if (widgetId !== undefined) window.turnstile?.reset(widgetId);
    },
  };
}
