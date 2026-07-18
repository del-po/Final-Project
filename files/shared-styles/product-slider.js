document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-slider").forEach((slider) => {
    const track = slider.querySelector(".product-gallery-track");
    const leftArrow = slider.querySelector(".left-arrow");
    const rightArrow = slider.querySelector(".right-arrow");

    if (!track || !leftArrow || !rightArrow) return;

    const originalItems = Array.from(track.children).filter(
      (item) => !item.classList.contains("product-gallery-clone"),
    );

    if (!originalItems.length) return;

    const isCategorySlider = slider.classList.contains("category-slider");

    let clonedItems = 0;
    let currentPosition = 0;
    let isMoving = false;
    let isActive = false;
    let resizeTimer;

    function shouldActivateSlider() {
      if (isCategorySlider) {
        return window.innerWidth <= 750;
      }

      return true;
    }

    function getVisibleItems() {
      if (isCategorySlider) {
        return 1;
      }

      return window.innerWidth <= 750 ? 1 : 4;
    }

    function getStepSize() {
      const itemWidth = originalItems[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

      return itemWidth + gap;
    }

    function moveSlider(animate = true) {
      track.style.transition = animate ? "transform 0.4s ease" : "none";

      track.style.transform = `translateX(-${
        currentPosition * getStepSize()
      }px)`;
    }

    function removeClones() {
      track
        .querySelectorAll(".product-gallery-clone")
        .forEach((clone) => clone.remove());
    }

    function resetSlider() {
      removeClones();

      clonedItems = 0;
      currentPosition = 0;
      isMoving = false;
      isActive = false;

      track.style.removeProperty("transition");
      track.style.removeProperty("transform");
    }

    function createInfiniteTrack() {
      removeClones();

      isMoving = false;

      if (!shouldActivateSlider()) {
        resetSlider();
        return;
      }

      isActive = true;
      clonedItems = Math.min(getVisibleItems(), originalItems.length);

      const firstClones = originalItems.slice(0, clonedItems).map((item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("product-gallery-clone");

        return clone;
      });

      const lastClones = originalItems.slice(-clonedItems).map((item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("product-gallery-clone");

        return clone;
      });

      track.prepend(...lastClones);
      track.append(...firstClones);

      currentPosition = clonedItems;
      moveSlider(false);

      requestAnimationFrame(() => {
        if (isActive) {
          track.style.transition = "transform 0.4s ease";
        }
      });
    }

    rightArrow.addEventListener("click", () => {
      if (!isActive || isMoving) return;

      isMoving = true;
      currentPosition++;
      moveSlider();
    });

    leftArrow.addEventListener("click", () => {
      if (!isActive || isMoving) return;

      isMoving = true;
      currentPosition--;
      moveSlider();
    });

    track.addEventListener("transitionend", (event) => {
      if (
        !isActive ||
        event.target !== track ||
        event.propertyName !== "transform"
      ) {
        return;
      }

      if (currentPosition >= originalItems.length + clonedItems) {
        currentPosition = clonedItems;
        moveSlider(false);
      }

      if (currentPosition < clonedItems) {
        currentPosition = originalItems.length + clonedItems - 1;
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
