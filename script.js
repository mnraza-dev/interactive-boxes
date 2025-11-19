document.addEventListener("DOMContentLoaded", () => {

  const qsAll = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const qs = (sel, ctx = document) => (ctx || document).querySelector(sel);

  const productOptions = qsAll(".product-option");
  const totalEl = qs(".total");

  if (!productOptions.length || !totalEl) return;

  const deactivateAll = () => {
    productOptions.forEach(opt => {
      opt.classList.remove("active");
      const extra = qs(".extra-options", opt);
      if (extra) extra.style.display = "none";
    });
  };

  const updateTotal = (price) => {
    const p = typeof price === "undefined" ? 0 : price;
    totalEl.textContent = `Total : $${p}.00 USD`;
  };

  productOptions.forEach(opt => {
    const radio = qs("input[type='radio']", opt);
    const extra = qs(".extra-options", opt);
    if (!radio) return;

    const onRadioChange = () => {
      if (!radio.checked) return;
      deactivateAll();
      opt.classList.add("active");
      if (extra) extra.style.display = "block";
      const price = opt.dataset.price || 0;
      updateTotal(price);
    };

    radio.addEventListener("change", onRadioChange);

    opt.addEventListener("click", (e) => {
      if (e.target.closest(".custom-select") ||
          e.target.matches("input, button, select, label, .options, .option")) {
        return;
      }
      if (!radio.checked) {
        radio.checked = true;
        onRadioChange();
      }
    });
  });

  const checkedOpt = productOptions.find(opt => qs("input[type='radio']", opt)?.checked);
  if (checkedOpt) {
    const r = qs("input[type='radio']", checkedOpt);
    r.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    const first = productOptions[0];
    const fr = qs("input[type='radio']", first);
    if (fr) {
      fr.checked = true;
      fr.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /* --------- CUSTOM SELECT INITIALIZATION --------- */

  const looksLikePlaceholder = (text = "") => {
    const t = String(text).trim().toLowerCase();
    if (!t) return true;
    return /^(select|select size|select an option|colour|color|choose|choose size)$/i.test(t) ||
           /select|colour|color|choose/i.test(t);
  };

  qsAll(".custom-select").forEach(selectRoot => {
    const optionsEl = qs(".options", selectRoot);
    if (!optionsEl) return;

    const firstOption = qs(".option", optionsEl);
    let selectedEl = qs(".selected", selectRoot);
    if (!selectedEl) {
      selectedEl = document.createElement("div");
      selectedEl.className = "selected";
      selectRoot.insertBefore(selectedEl, optionsEl);
    }

    if (firstOption) {
      if (looksLikePlaceholder(selectedEl.textContent)) {
        selectedEl.textContent = firstOption.textContent;
        selectRoot.dataset.value = firstOption.textContent;
      } else {
        selectRoot.dataset.value = selectedEl.textContent;
      }
    }
  });

  const closeAllSelects = () => {
    qsAll(".custom-select .options").forEach(o => { o.style.display = "none"; });
  };

  const toggleSelect = (selectEl) => {
    const optionsEl = qs(".options", selectEl);
    if (!optionsEl) return;
    optionsEl.style.display = optionsEl.style.display === "block" ? "none" : "block";
  };

  document.addEventListener("click", (e) => {
    const clickedOption = e.target.closest(".custom-select .option");
    const clickedSelect = e.target.closest(".custom-select");

    if (clickedOption && clickedSelect) {
      const selectRoot = clickedSelect;
      const selectedEl = qs(".selected", selectRoot);
      const optionsEl = qs(".options", selectRoot);
      if (selectedEl) selectedEl.textContent = clickedOption.textContent;
      if (selectRoot) selectRoot.dataset.value = clickedOption.textContent;
      if (optionsEl) optionsEl.style.display = "none";
      return;
    }

    if (e.target.closest(".custom-select .selected")) {
      const selectRoot = e.target.closest(".custom-select");
      closeAllSelects();
      toggleSelect(selectRoot);
      return;
    }

    if (!clickedSelect) {
      closeAllSelects();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllSelects();
  });

});
