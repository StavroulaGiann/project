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
    // εδώ κώδικας ειδικά για index.html αν χρειαστεί
  }

  if (page === "courses") {
    // φόρτωσε μαθήματα από courses.js
    initCoursesPage();
  }

  if (page === "books") {
  initBooksPage();
}

if (page === "books-details") {
  initBookDetailsPage();
}

  if (page === "courses-details") {
  initCourseDetailsPage();
  }

  if (page === "register") {
    // προς το παρόν, όλη η λογική είναι στο register-form.js (IIFE),
    // οπότε δεν χρειάζεται κάτι εδώ.
    console.log("Register page loaded");
  }
});


// =============================
// bokks details pages
// 

function initBookDetailsPage() {
  if (!window.BOOKS || !Array.isArray(window.BOOKS)) {
    console.warn("BOOKS data not found");
    return;
  }

  const container = document.getElementById("bookDetailsContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const book = window.BOOKS.find((b) => b.id === id);

  if (!book) {
    container.innerHTML = `
      <section class="courses-page-header" style="margin-top:2rem;">
        <h1 class="section-title">Το βιβλίο δεν βρέθηκε</h1>
        <p class="section-subtitle">
          Ίσως ο σύνδεσμος είναι λάθος ή το βιβλίο δεν είναι πλέον διαθέσιμο.
        </p>
        <p style="margin-top:1rem;">
          <a href="books.html" class="btn btn-primary">Πίσω στα Books</a>
        </p>
      </section>
    `;
    return;
  }

  const categoryLabel = mapCategory(book.category);
  const levelLabel = mapLevel(book.level);

  container.innerHTML = `
    <section class="courses-page-header" style="margin-top:2rem;">
      <div class="pill">
        <span class="pill-dot"></span>
        <span>${categoryLabel || "Book"}</span>
      </div>

      <h1 class="section-title">${escapeHtml(book.title)}</h1>
      ${
        book.subtitle
          ? `<p class="section-subtitle">${escapeHtml(book.subtitle)}</p>`
          : ""
      }
    </section>

    <section class="course-details-layout" style="margin:1.5rem 0 3rem; display:grid; gap:1.5rem;">
      <article class="course-card">
        <div class="course-badges">
          ${levelLabel ? `<span class="course-badge">${levelLabel}</span>` : ""}
          ${
            book.isNew
              ? `<span class="course-badge">New</span>`
              : ""
          }
          ${
            book.popular
              ? `<span class="course-badge">Popular</span>`
              : ""
          }
        </div>

        <div class="course-meta" style="margin-top:0.75rem;">
          ${
            book.author
              ? `<span>✍️ ${escapeHtml(book.author)}</span>`
              : ""
          }
          ${
            book.year
              ? `<span>📅 ${book.year}</span>`
              : ""
          }
          ${
            book.pages
              ? `<span>📖 ${book.pages} σελίδες</span>`
              : ""
          }
          ${
            book.language
              ? `<span>🌐 ${book.language === "GR" ? "Ελληνικά" : "Αγγλικά"}</span>`
              : ""
          }
        </div>

        <p class="section-subtitle" style="margin-top:0.75rem;">
          ${escapeHtml(book.longDescription || book.shortDescription || "")}
        </p>

        <div class="course-actions" style="margin-top:1.25rem;">
          <a href="register.html" class="btn btn-primary">
            Εγγραφή στην πλατφόρμα
          </a>
          ${
            book.rating && book.ratingCount
              ? `<span class="course-rating"><strong>★ ${book.rating.toFixed(
                  1
                )}</strong> (${book.ratingCount})</span>`
              : ""
          }
        </div>
      </article>
    </section>
  `;
}




// =============================
// bokks pages
// 

function initBooksPage() {
  if (!window.BOOKS || !Array.isArray(window.BOOKS)) {
    console.warn("❗ BOOKS data not found. Έλεγξε το assets/js/data/books.js");
    return;
  }

  const grid = document.getElementById("booksGrid");
  const countEl = document.getElementById("booksCount");
  const emptyEl = document.getElementById("booksEmpty");

  if (!grid) {
    console.warn("❗ #booksGrid δεν βρέθηκε στο DOM.");
    return;
  }

  const searchInput = document.getElementById("bookSearchInput");
  const categoryFilter = document.getElementById("bookCategoryFilter");
  const levelFilter = document.getElementById("bookLevelFilter");
  const availabilityFilter = document.getElementById("bookAvailabilityFilter");
  const languageFilter = document.getElementById("bookLanguageFilter");
  const sortBySelect = document.getElementById("bookSortBy");

  function applyFiltersAndRender() {
    let filtered = window.BOOKS.slice();

    const q = (searchInput?.value || "").trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((book) => {
        const text =
          (book.title || "") +
          " " +
          (book.subtitle || "") +
          " " +
          (book.author || "") +
          " " +
          (book.shortDescription || "") +
          " " +
          (Array.isArray(book.tags) ? book.tags.join(" ") : "");
        return text.toLowerCase().includes(q);
      });
    }

    const category = categoryFilter?.value || "";
    if (category) {
      filtered = filtered.filter((b) => b.category === category);
    }

    const level = levelFilter?.value || "";
    if (level) {
      filtered = filtered.filter((b) => b.level === level);
    }

    const availability = availabilityFilter?.value || "";
    if (availability === "available") {
      filtered = filtered.filter((b) => b.available === true);
    }

    const language = languageFilter?.value || "";
    if (language) {
      filtered = filtered.filter((b) => b.language === language);
    }

    const sortBy = sortBySelect?.value || "featured";
    filtered = sortBooks(filtered, sortBy);

    renderBooks(filtered);
  }

  function sortBooks(books, sortBy) {
    const sorted = books.slice();

    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === "pages") {
      sorted.sort((a, b) => (a.pages || 0) - (b.pages || 0));
    } else if (sortBy === "featured") {
      sorted.sort((a, b) => {
        const aFeat = a.isFeatured ? 1 : 0;
        const bFeat = b.isFeatured ? 1 : 0;
        if (bFeat !== aFeat) return bFeat - aFeat;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    return sorted;
  }

  function renderBooks(books) {
    grid.innerHTML = "";

    if (!books.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (countEl) countEl.textContent = "0 books";
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (countEl) {
      countEl.textContent =
        books.length === 1 ? "1 book" : `${books.length} books`;
    }

    books.forEach((book) => {
      const card = document.createElement("article");
      card.className = "course-card";

      const categoryLabel = mapCategory(book.category);
      const levelLabel = mapLevel(book.level);

      const badges = [];

      if (categoryLabel) {
        badges.push(
          `<span class="course-badge course-badge--primary">${categoryLabel}</span>`
        );
      }

      if (levelLabel) {
        badges.push(`<span class="course-badge">${levelLabel}</span>`);
      }

      if (book.isNew) {
        badges.push(`<span class="course-badge">New</span>`);
      }

      if (book.popular) {
        badges.push(`<span class="course-badge">Popular</span>`);
      }

      const ratingHtml =
        book.rating && book.ratingCount
          ? `<span class="course-rating">
              <strong>★ ${book.rating.toFixed(1)}</strong> (${book.ratingCount})
            </span>`
          : "";

      const metaParts = [];

      if (book.author) {
        metaParts.push(`✍️ ${book.author}`);
      }
      if (book.year) {
        metaParts.push(`📅 ${book.year}`);
      }
      if (book.pages) {
        metaParts.push(`📖 ${book.pages} σελίδες`);
      }

      const metaHtml = metaParts.map((txt) => `<span>${txt}</span>`).join("");

      card.innerHTML = `
        <div class="course-card-header">
          <div>
            <h3 class="course-title">${escapeHtml(book.title || "")}</h3>
            ${
              book.subtitle
                ? `<p class="course-subtitle">${escapeHtml(book.subtitle)}</p>`
                : ""
            }
            <div class="course-badges">
              ${badges.join("")}
            </div>
          </div>
        </div>

        ${
          book.shortDescription
            ? `<p class="section-subtitle" style="margin-top:0.5rem;">${escapeHtml(
                book.shortDescription
              )}</p>`
            : ""
        }

        <div class="course-meta">
          ${metaHtml}
        </div>

        <div class="course-actions">
          <a href="books-details.html?id=${encodeURIComponent(
            book.id
          )}" class="btn btn-primary">
            Περισσότερα
          </a>
          ${ratingHtml}
        </div>
      `;

      grid.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFiltersAndRender);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (levelFilter) {
    levelFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (availabilityFilter) {
    availabilityFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (languageFilter) {
    languageFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (sortBySelect) {
    sortBySelect.addEventListener("change", applyFiltersAndRender);
  }

  applyFiltersAndRender();
}


// =============================
// δεταιλ Courses page
// =============================

function initCourseDetailsPage() {
  if (!window.COURSES || !Array.isArray(window.COURSES)) {
    console.warn("COURSES data not found");
    return;
  }

  const container = document.getElementById("courseDetailsContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const course = window.COURSES.find((c) => c.id === id);

  if (!course) {
    container.innerHTML = `
      <section class="courses-page-header" style="margin-top:2rem;">
        <h1 class="section-title">Το μάθημα δεν βρέθηκε</h1>
        <p class="section-subtitle">
          Ίσως ο σύνδεσμος είναι λάθος ή το μάθημα δεν είναι πλέον διαθέσιμο.
        </p>
        <p style="margin-top:1rem;">
          <a href="courses.html" class="btn btn-primary">Πίσω στα Courses</a>
        </p>
      </section>
    `;
    return;
  }

  const categoryLabel = mapCategory(course.category);
  const levelLabel = mapLevel(course.level);

  container.innerHTML = `
    <section class="courses-page-header" style="margin-top:2rem;">
      <div class="pill">
        <span class="pill-dot"></span>
        <span>${categoryLabel || "Course"}</span>
      </div>

      <h1 class="section-title">${escapeHtml(course.title)}</h1>
      ${
        course.subtitle
          ? `<p class="section-subtitle">${escapeHtml(course.subtitle)}</p>`
          : ""
      }
    </section>

    <section class="courses-details-layout" style="margin:1.5rem 0 3rem; display:grid; gap:1.5rem;">
      <article class="course-card">
        <div class="course-badges">
          ${
            levelLabel
              ? `<span class="course-badge">${levelLabel}</span>`
              : ""
          }
          ${
            course.isNew
              ? `<span class="course-badge">New</span>`
              : ""
          }
          ${
            course.popular
              ? `<span class="course-badge">Popular</span>`
              : ""
          }
        </div>

        ${
          course.longDescription
            ? `<p class="section-subtitle" style="margin-top:0.75rem;">${escapeHtml(
                course.longDescription
              )}</p>`
            : `<p class="section-subtitle" style="margin-top:0.75rem;">${escapeHtml(
                course.shortDescription || ""
              )}</p>`
        }

        <div class="course-meta" style="margin-top:0.75rem;">
          ${
            course.duration
              ? `<span>⏱ ${course.duration}</span>`
              : ""
          }
          ${
            course.lessonsCount
              ? `<span>📚 ${course.lessonsCount} lessons</span>`
              : ""
          }
          ${
            course.mode
              ? `<span>💻 ${course.mode}</span>`
              : ""
          }
        </div>

        <div class="course-actions" style="margin-top:1.25rem;">
          <a href="register.html" class="btn btn-primary">
            Εγγραφή στο μάθημα
          </a>
          ${
            course.rating && course.ratingCount
              ? `<span class="course-rating"><strong>★ ${course.rating.toFixed(
                  1
                )}</strong> (${course.ratingCount})</span>`
              : ""
          }
        </div>
      </article>
    </section>
  `;
}

// =============================
// Courses page
// =============================

function initCoursesPage() {
  if (!window.COURSES || !Array.isArray(window.COURSES)) {
    console.warn("❗ COURSES data not found. Έλεγξε το assets/js/data/courses.js");
    return;
  }

  const grid = document.getElementById("coursesGrid");
  const countEl = document.getElementById("coursesCount");
  const emptyEl = document.getElementById("coursesEmpty");

  if (!grid) {
    console.warn("❗ #coursesGrid δεν βρέθηκε στο DOM.");
    return;
  }

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const levelFilter = document.getElementById("levelFilter");
  const availabilityFilter = document.getElementById("availabilityFilter");
  const languageFilter = document.getElementById("languageFilter");
  const sortBySelect = document.getElementById("sortBy");

  function applyFiltersAndRender() {
    let filtered = window.COURSES.slice();

    // 🔎 Αναζήτηση (τίτλος, υπότιτλος, περιγραφή, tags)
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((course) => {
        const text =
          (course.title || "") +
          " " +
          (course.subtitle || "") +
          " " +
          (course.shortDescription || "") +
          " " +
          (Array.isArray(course.tags) ? course.tags.join(" ") : "");

        return text.toLowerCase().includes(q);
      });
    }

    // 📂 Κατηγορία
    const category = categoryFilter?.value || "";
    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }

    // 🎯 Επίπεδο
    const level = levelFilter?.value || "";
    if (level) {
      filtered = filtered.filter((c) => c.level === level);
    }

    // ✅ Διαθεσιμότητα
    const availability = availabilityFilter?.value || "";
    if (availability === "available") {
      filtered = filtered.filter((c) => c.available === true);
    }

    // 🌐 Γλώσσα
    const language = languageFilter?.value || "";
    if (language) {
      filtered = filtered.filter((c) => c.language === language);
    }

    // 🔽 Ταξινόμηση
    const sortBy = sortBySelect?.value || "featured";
    filtered = sortCourses(filtered, sortBy);

    renderCourses(filtered);
  }

  function sortCourses(courses, sortBy) {
    const sorted = courses.slice();

    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => {
        const aNew = a.isNew ? 1 : 0;
        const bNew = b.isNew ? 1 : 0;
        return bNew - aNew;
      });
    } else if (sortBy === "duration") {
      sorted.sort((a, b) => {
        const aWeeks = parseInt((a.duration || "0").match(/\d+/)?.[0] || "0", 10);
        const bWeeks = parseInt((b.duration || "0").match(/\d+/)?.[0] || "0", 10);
        return aWeeks - bWeeks;
      });
    } else if (sortBy === "featured") {
      sorted.sort((a, b) => {
        const aFeat = a.isFeatured ? 1 : 0;
        const bFeat = b.isFeatured ? 1 : 0;
        if (bFeat !== aFeat) return bFeat - aFeat;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    return sorted;
  }

  function renderCourses(courses) {
  grid.innerHTML = "";

  if (!courses.length) {
    if (emptyEl) emptyEl.hidden = false;
    if (countEl) countEl.textContent = "0 courses";
    return;
  }

  if (emptyEl) emptyEl.hidden = true;
  if (countEl) {
    countEl.textContent =
      courses.length === 1 ? "1 course" : `${courses.length} courses`;
  }

  courses.forEach((course) => {
    const card = document.createElement("article");
    card.className = "course-card";

    const categoryLabel = mapCategory(course.category);
    const levelLabel = mapLevel(course.level);

    const badges = [];

    if (categoryLabel) {
      badges.push(
        `<span class="course-badge course-badge--primary">${categoryLabel}</span>`
      );
    }

    if (levelLabel) {
      badges.push(`<span class="course-badge">${levelLabel}</span>`);
    }

    if (course.isNew) {
      badges.push(`<span class="course-badge">New</span>`);
    }

    if (course.popular) {
      badges.push(`<span class="course-badge">Popular</span>`);
    }

    const ratingHtml =
      course.rating && course.ratingCount
        ? `<span class="course-rating">
            <strong>★ ${course.rating.toFixed(1)}</strong> (${course.ratingCount})
          </span>`
        : "";

    const metaParts = [];

    if (course.duration) {
      metaParts.push(`⏱ ${course.duration}`);
    }
    if (course.lessonsCount) {
      metaParts.push(`📚 ${course.lessonsCount} lessons`);
    }
    if (course.mode) {
      metaParts.push(`💻 ${course.mode}`);
    }

    const metaHtml = metaParts.map((txt) => `<span>${txt}</span>`).join("");

    // 🔽 ΕΔΩ φτιάχνουμε το HTML της κάρτας
    card.innerHTML = `
      <div class="course-card-header">
        <div>
          <h3 class="course-title">${escapeHtml(course.title || "")}</h3>
          ${
            course.subtitle
              ? `<p class="course-subtitle">${escapeHtml(course.subtitle)}</p>`
              : ""
          }
          <div class="course-badges">
            ${badges.join("")}
          </div>
        </div>
      </div>

      ${
        course.shortDescription
          ? `<p class="section-subtitle" style="margin-top:0.5rem;">${escapeHtml(
              course.shortDescription
            )}</p>`
          : ""
      }

      <div class="course-meta">
        ${metaHtml}
      </div>

      <div class="course-actions">
        <button
          type="button"
          class="btn btn-primary course-more-btn"
          data-course-id="${course.id}"
        >
          Περισσότερα
        </button>
        ${ratingHtml}
      </div>
    `;

    // ➕ ΕΔΩ δένουμε το κουμπί «Περισσότερα» με το modal
    const moreBtn = card.querySelector(".course-more-btn");
    if (moreBtn && typeof window.openModal === "function") {
      moreBtn.addEventListener("click", () => {
        openModal(`
          <h2 class="section-title">${escapeHtml(course.title || "")}</h2>
          ${
            course.subtitle
              ? `<p class="section-subtitle">${escapeHtml(course.subtitle)}</p>`
              : ""
          }

          <div class="course-meta" style="margin-top:0.75rem;">
            ${metaHtml}
          </div>

          <p class="section-subtitle" style="margin-top:0.75rem;">
            ${escapeHtml(course.longDescription || course.shortDescription || "")}
          </p>

          <div class="course-actions" style="margin-top:1.25rem; justify-content:flex-start; gap:0.75rem;">
            <a href="courses-details.html?id=${encodeURIComponent(
              course.id
            )}" class="btn btn-primary">
              Πλήρεις λεπτομέρειες
            </a>
            <a href="register.html" class="btn">
              Εγγραφή στο μάθημα
            </a>
          </div>
        `);
      });
    }

    grid.appendChild(card);
  });
}


  // Event listeners στα φίλτρα
  if (searchInput) {
    searchInput.addEventListener("input", applyFiltersAndRender);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (levelFilter) {
    levelFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (availabilityFilter) {
    availabilityFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (languageFilter) {
    languageFilter.addEventListener("change", applyFiltersAndRender);
  }
  if (sortBySelect) {
    sortBySelect.addEventListener("change", applyFiltersAndRender);
  }

  // πρώτη φόρτωση
  applyFiltersAndRender();
}

// =============================
// Helpers
// =============================

function mapCategory(cat) {
  switch (cat) {
    case "programming":
      return "Programming";
    case "web":
      return "Web Development";
    case "networks":
      return "Networks";
    case "security":
      return "Cyber Security";
    case "databases":
      return "Databases";
    case "tools":
      return "Tools";
    case "devops":
      return "DevOps";
    default:
      return "";
  }
}

function mapLevel(level) {
  switch (level) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return "";
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
