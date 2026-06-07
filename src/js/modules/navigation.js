export function initNavigation() {
  const menuToggle = document.querySelector("#menu-toggle");
  const menuText = document.querySelector("#menu-text");
  const mobileMenu = document.querySelector("#mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuToggle || !mobileMenu) return;

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");

    if (menuText) menuText.textContent = "Menu";

    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("block");

    document.body.classList.remove("overflow-hidden");
  }

  function openMenu() {
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");

    if (menuText) menuText.textContent = "Close";

    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("block");

    document.body.classList.add("overflow-hidden");
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    isExpanded ? closeMenu() : openMenu();

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  });
}
