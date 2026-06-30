import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initLightbox } from "./modules/lightbox.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initContactForm();
  initLightbox();
});
