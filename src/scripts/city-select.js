/**
 * city-select.js - keeps the City dropdown in sync with the selected State.
 *
 * The State select carries the full state -> cities map as JSON in
 * [data-city-source]; the City select is prerendered with the default state's
 * cities so the form still works without JavaScript. The City list is only ever
 * built from the selected state's own entry - there is no global fallback list,
 * so cities from other states can never appear under Michigan.
 */
export function initCitySelect() {
  document.querySelectorAll("select[data-city-state]").forEach((stateSelect) => {
    const form = stateSelect.closest("form");
    if (!form) return;

    const source = form.querySelector("[data-city-source]");
    const citySelect = form.querySelector("select[data-city-select]");
    if (!citySelect) return;

    let cities = {};
    if (source) {
      try {
        cities = JSON.parse(source.textContent ?? "{}") || {};
      } catch {
        cities = {};
      }
    }

    const placeholder = citySelect.dataset.cityPlaceholder || "City";

    /** Returns the city list for a state, or null when the state is unknown. */
    const optionsFor = (state) => (Array.isArray(cities[state]) ? cities[state] : null);

    const render = (state) => {
      const list = optionsFor(state);
      // Unknown state: keep whatever is rendered rather than inventing a list.
      if (!list) return;

      const previous = citySelect.value;
      const keep = list.includes(previous) ? previous : "";

      const fragment = document.createDocumentFragment();

      const first = document.createElement("option");
      first.value = "";
      first.disabled = true;
      first.textContent = placeholder;
      first.selected = keep === "";
      fragment.append(first);

      list.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        option.selected = city === keep;
        fragment.append(option);
      });

      citySelect.replaceChildren(fragment);
      citySelect.value = keep;
    };

    const syncFromState = () => render(stateSelect.value);

    stateSelect.addEventListener("change", syncFromState);
    stateSelect.addEventListener("input", syncFromState);

    // Restored pages (back/forward cache) can bring back a dropdown pairing
    // that no longer matches; re-sync whenever the page is shown again.
    window.addEventListener("pageshow", syncFromState);

    form.addEventListener("reset", () => {
      requestAnimationFrame(syncFromState);
    });

    // Last line of defence: never submit a city that does not belong to the
    // selected state.
    form.addEventListener(
      "submit",
      () => {
        const list = optionsFor(stateSelect.value) || [];
        if (citySelect.value && !list.includes(citySelect.value)) {
          citySelect.value = "";
        }
      },
      true
    );

    // Align the select with the state that is actually selected on load.
    syncFromState();
  });
}
