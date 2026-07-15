/**
 * @file lightbox.js
 * @description Lightbox module utilizing native HTML5 Dialog APIs and Top-Layer rendering.
 * @module modules/lightbox
 */

/**
 * Initializes the image lightbox module by setting up DOM elements and binding event listeners.
 * @returns {void}
 */
export function initLightbox() {
  const dialog = document.querySelector("#lightbox-dialog");
  const closeBtn = document.querySelector("#lightbox-close-btn");
  const targetImg = document.querySelector("#lightbox-target-img");
  const triggers = document.querySelectorAll("[data-lightbox-src]");

  if (!dialog || !closeBtn || !targetImg || triggers.length === 0) return;

  /**
   * Opens the Lightbox dialog window overlay.
   * @param {string} hiResSrc - File path string for the high-resolution picture asset.
   * @param {string} altText - Accessibility alternate text metadata.
   */
  function openLightbox(hiResSrc, altText) {
    targetImg.src = hiResSrc;
    targetImg.alt = altText;

    dialog.classList.remove("hidden");
    dialog.showModal();
    document.body.classList.add("overflow-hidden");

    const imgWrapper = targetImg.parentElement;
    if (imgWrapper) {
      requestAnimationFrame(() => {
        imgWrapper.classList.remove("scale-95");
        imgWrapper.classList.add("scale-100");
      });
    }
  }

  /**
   * Closes the Lightbox dialog window overlay.
   */
  function closeLightbox() {
    const imgWrapper = targetImg.parentElement;
    if (imgWrapper) {
      imgWrapper.classList.remove("scale-100");
      imgWrapper.classList.add("scale-95");
    }

    dialog.close();
    dialog.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");

    targetImg.removeAttribute("src");
    targetImg.alt = "";
  }

  // --- Event Bindings ---
  triggers.forEach((btnTrigger) => {
    btnTrigger.addEventListener("click", () => {
      const hiResPath = btnTrigger.getAttribute("data-lightbox-src");
      const innerImgAlt = btnTrigger.querySelector("img")?.alt || "";

      openLightbox(hiResPath, innerImgAlt);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeLightbox();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });
}
