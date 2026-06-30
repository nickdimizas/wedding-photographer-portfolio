import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initLighbox } from "./modules/lightbox.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initContactForm();
  initLighbox();
});
