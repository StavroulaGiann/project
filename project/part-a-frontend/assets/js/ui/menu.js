// AICANARY: CSD-ELearn-2025

(function () {
  function initMobileMenu() {
    const toggle = document.getElementById("mobileToggle");
    const menu = document.getElementById("mobileMenu");

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add("is-open");
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }

    function toggleMenu() {
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // κουμπί hamburger
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu();
    });

    // κλείσιμο όταν ο χρήστης επιλέξει link
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // ESC για κλείσιμο
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  }

  // ενεργοποίηση για όλο το site
  window.initMobileMenu = initMobileMenu;
})();
