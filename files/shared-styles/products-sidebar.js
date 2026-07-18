document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".price-filter").forEach((priceFilter) => {
    const priceRange = priceFilter.querySelector(".price-range");
    const minimumInput = priceFilter.querySelector(".price-range-min");
    const maximumInput = priceFilter.querySelector(".price-range-max");
    const minimumText = priceFilter.querySelector(".price-min-value");
    const maximumText = priceFilter.querySelector(".price-max-value");

    if (
      !priceRange ||
      !minimumInput ||
      !maximumInput ||
      !minimumText ||
      !maximumText
    ) {
      return;
    }

    const minimumAllowed = Number(minimumInput.min);
    const maximumAllowed = Number(maximumInput.max);
    const minimumGap = Number(minimumInput.step) || 1;

    function formatPrice(value) {
      return `$${Number(value).toLocaleString("en-US")}`;
    }

    function updatePriceRange(changedInput) {
      let minimumValue = Number(minimumInput.value);
      let maximumValue = Number(maximumInput.value);

      if (maximumValue - minimumValue < minimumGap) {
        if (changedInput === minimumInput) {
          minimumValue = maximumValue - minimumGap;
        } else {
          maximumValue = minimumValue + minimumGap;
        }
      }

      minimumValue = Math.max(minimumAllowed, minimumValue);
      maximumValue = Math.min(maximumAllowed, maximumValue);

      minimumInput.value = minimumValue;
      maximumInput.value = maximumValue;

      const totalRange = maximumAllowed - minimumAllowed;

      const minimumPosition =
        ((minimumValue - minimumAllowed) / totalRange) * 100;

      const maximumPosition =
        ((maximumValue - minimumAllowed) / totalRange) * 100;

      priceRange.style.setProperty("--minimum-position", `${minimumPosition}%`);

      priceRange.style.setProperty("--maximum-position", `${maximumPosition}%`);

      minimumText.textContent = formatPrice(minimumValue);
      maximumText.textContent = formatPrice(maximumValue);
    }

    minimumInput.addEventListener("input", () => {
      updatePriceRange(minimumInput);
    });

    maximumInput.addEventListener("input", () => {
      updatePriceRange(maximumInput);
    });

    minimumInput.addEventListener("pointerdown", () => {
      minimumInput.style.zIndex = "3";
      maximumInput.style.zIndex = "2";
    });

    maximumInput.addEventListener("pointerdown", () => {
      maximumInput.style.zIndex = "3";
      minimumInput.style.zIndex = "2";
    });

    updatePriceRange();
  });
});
