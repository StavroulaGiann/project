// AICANARY: CSD-ELearn-2025

export function initMobileMenu() {
  const toggle = document.getElementById("mobileToggle");
  const menu = document.getElementById("mobileMenu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.style.display === "flex";
    menu.style.display = isOpen ? "none" : "flex";
    toggle.classList.toggle("mobile-nav-open", !isOpen);
  });
}
