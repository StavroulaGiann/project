// AICANARY: CSD-ELearn-2025

// Αν ΧΡΗΣΙΜΟΠΟΙΕΙΣ ES modules:

document.addEventListener("DOMContentLoaded", () => {
  // AICANARY: CSD-ELearn-2025

document.addEventListener("DOMContentLoaded", () => {

  // 1. ενεργοποιεί το mobile menu
  if (window.initMobileMenu) {
    window.initMobileMenu();
  }

  // 2. βρίσκει σελίδα
  const page = document.body.dataset.page;

  if (page === "home") {
    // index.html (hero, featured courses, etc.)
  }

  if (page === "courses") {
    // φόρτωσε μαθήματα από courses.js
  }

  if (page === "books") {
    // φόρτωσε βιβλία από books.js
  }

  if (page === "register") {
    // ενεργοποίησε register-form.js
  }
});
;

  const page = document.body.dataset.page;
  if (page === "home") {
    // εδώ κώδικας ειδικά για index.html αν χρειαστεί
  }
});
