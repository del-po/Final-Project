document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-slider").forEach((slider) => {
    const track = slider.querySelector(".product-gallery-track");
    const leftArrow = slider.querySelector(".left-arrow");
    const rightArrow = slider.querySelector(".right-arrow");

    if (!track || !leftArrow || !rightArrow) return;

    const originalProducts = Array.from(track.children);

    let visibleProducts;
    let currentPosition;
    let isMoving = false;
    let resizeTimer;

    function getStepSize() {
      const productWidth = originalProducts[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

      return productWidth + gap;
    }

    function moveSlider(animate = true) {
      track.style.transition = animate ? "transform 0.4s ease" : "none";

      track.style.transform = `translateX(-${
        currentPosition * getStepSize()
      }px)`;
    }

    function createInfiniteTrack() {
      track
        .querySelectorAll(".product-gallery-clone")
        .forEach((clone) => clone.remove());

      visibleProducts = window.innerWidth <= 750 ? 1 : 4;

      const firstClones = originalProducts
        .slice(0, visibleProducts)
        .map((product) => {
          const clone = product.cloneNode(true);
          clone.classList.add("product-gallery-clone");

          return clone;
        });

      const lastClones = originalProducts
        .slice(-visibleProducts)
        .map((product) => {
          const clone = product.cloneNode(true);
          clone.classList.add("product-gallery-clone");

          return clone;
        });

      track.prepend(...lastClones);
      track.append(...firstClones);

      currentPosition = visibleProducts;
      moveSlider(false);

      requestAnimationFrame(() => {
        track.style.transition = "transform 0.4s ease";
      });
    }

    rightArrow.addEventListener("click", () => {
      if (isMoving) return;

      isMoving = true;
      currentPosition++;
      moveSlider();
    });

    leftArrow.addEventListener("click", () => {
      if (isMoving) return;

      isMoving = true;
      currentPosition--;
      moveSlider();
    });

    track.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;

      if (currentPosition >= originalProducts.length + visibleProducts) {
        currentPosition = visibleProducts;
        moveSlider(false);
      }

      if (currentPosition < visibleProducts) {
        currentPosition = originalProducts.length + visibleProducts - 1;
        moveSlider(false);
      }

      isMoving = false;
    });

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        createInfiniteTrack();
      }, 150);
    });

    createInfiniteTrack();
  });
});
