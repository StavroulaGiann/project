

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile menu
  if (window.initMobileMenu) {
    window.initMobileMenu();
  }

  // 2. 3D tilt σε κάρτες σε ΟΛΕΣ τις σελίδες
  initGlobalTiltCards();
  initScrollReveal();
  // 3. Routing ανά σελίδα
  const page = document.body.dataset.page;

  if (page === "home") {
    // Αν αργότερα θες κάτι έξτρα μόνο για index, βάλ' το εδώ
  }

  if (page === "courses") {
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
    console.log("Register page loaded");
  }
});




// =============================
// Scroll reveal για κάρτες & sections
// =============================

function initScrollReveal() {
  const selectors = [
    ".hero",
    ".section-header",
    ".tracks-grid .track-card",
    ".cards-grid .track-card",
    ".cards-grid .course-card",
    ".resource-list .track-card",
    ".course-card",
    ".team-card",
    ".about-block",
    ".about-highlight",
    ".contact-card",
    ".cta"
  ];

  const elements = document.querySelectorAll(selectors.join(","));
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Αν ο χρήστης δεν θέλει animations, τα εμφανίζουμε όλα κατευθείαν
  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // IntersectionObserver για reveal όταν μπαίνει στο viewport
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  elements.forEach((el) => {
    el.classList.add("reveal-on-scroll");
    observer.observe(el);
  });
}


// =============================
// GLOBAL 3D Tilt Effect
// =============================

function initGlobalTiltCards() {
  const rootStyles = getComputedStyle(document.documentElement);
const tiltEnabled = rootStyles.getPropertyValue("--tilt-enabled").trim() === "1";
const tiltPerspective = rootStyles.getPropertyValue("--tilt-perspective").trim() || "700px";
const tiltLift = rootStyles.getPropertyValue("--card-tilt-lift").trim() || "-2px";
  const selectors = [
    ".track-card",
    ".course-card",
    ".resource-list .track-card",
    ".team-card",
    ".about-block",
    ".about-highlight",
    ".contact-card",
    ".cta"
  ];

  const cards = document.querySelectorAll(selectors.join(","));
  if (!cards.length) return;

  const maxRotate = 10; // μοίρες

  cards.forEach((card) => {
    card.classList.add("tilt-card");

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * maxRotate * -1;
      const rotateX = ((y - midY) / midY) * maxRotate;

      if (!tiltEnabled) {
  card.style.transform = "none";
} else {
  card.style.transform = `
    perspective(${tiltPerspective})
    rotateX(${rotateX.toFixed(2)}deg)
    rotateY(${rotateY.toFixed(2)}deg)
    translateY(${tiltLift})
  `;}
      card.classList.add("is-tilting");
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
      card.classList.remove("is-tilting");
    });
  });
}


// =============================
// Books details page
// =============================

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
        <h1 class="section-title">The book was not found.</h1>
        <p class="section-subtitle">
          Maybe the link is wrong or the book is no longer available.
        </p>
        <p style="margin-top:1rem;">
          <a href="books.html" class="btn btn-primary">Back to Books</a>
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
          ${book.isNew ? `<span class="course-badge">New</span>` : ""}
          ${book.popular ? `<span class="course-badge">Popular</span>` : ""}
        </div>

        <div class="course-meta" style="margin-top:0.75rem;">
          ${
            book.author
              ? `<span>ᯓ★ ${escapeHtml(book.author)}</span>`
              : ""
          }
          ${book.year ? `<span>ᯓ★ ${book.year}</span>` : ""}
          ${
            book.pages
              ? `<span>ᯓ★ ${book.pages} pages</span>`
              : ""
          }
          ${
            book.language
              ? `<span>ᯓ★ ${
                  book.language === "GR" ? "Greek" : "English"
                }</span>`
              : ""
          }
        </div>

        <p class="section-subtitle" style="margin-top:0.75rem;">
          ${escapeHtml(book.longDescription || book.shortDescription || "")}
        </p>

        <div class="course-actions" style="margin-top:1.25rem;">
          <a href="register.html" class="btn btn-primary">
            Register now!
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
// Books list page
// =============================

function initBooksPage() {
  if (!window.BOOKS || !Array.isArray(window.BOOKS)) {
    console.warn(" BOOKS data not found. Έλεγξε το assets/js/data/books.js");
    return;
  }

  const grid = document.getElementById("booksGrid");
  const countEl = document.getElementById("booksCount");
  const emptyEl = document.getElementById("booksEmpty");

  if (!grid) {
    console.warn(" #booksGrid δεν βρέθηκε στο DOM.");
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
      card.className = "course-card book-card";  // <-- extra class για ειδικό layout

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
      const metaHtml = metaParts.map((txt) => `<span>${txt}</span>`).join("");

      // Χρησιμοποιούμε τα image fields από το books.js
      const imageHtml = book.image
        ? `
        <div class="book-card-cover">
          <img
            src="${book.image}"
            ${book.imageSrcSet ? `srcset="${book.imageSrcSet}"` : ""}
            ${book.imageSizes ? `sizes="${book.imageSizes}"` : ""}
            alt="${escapeHtml(book.title || "")}"
            loading="lazy"
          />
        </div>
      `
        : "";

      card.innerHTML = `
        <div class="book-card-inner">
          ${imageHtml}

          <div class="book-card-info">
            <div class="course-card-header">
              <div>
                <h3 class="course-title">${escapeHtml(book.title || "")}</h3>
                ${
                  book.subtitle
                    ? `<p class="course-subtitle">${escapeHtml(
                        book.subtitle
                      )}</p>`
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
                More...
              </a>
              ${ratingHtml}
            </div>
          </div>
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

function getCourseVideoMeta(courseId) {
  if (!window.COURSE_VIDEOS) return null;
  const meta = window.COURSE_VIDEOS[courseId];
  if (!meta) return null;
  return meta; // δέχεται είτε youtubeId είτε src
}



// =============================
// Course details page
// =============================

function initCourseDetailsPage() {
  const container = document.getElementById("courseDetailsContainer");
  if (!container) return;

  if (!window.COURSES) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const course = window.COURSES.find(c => c.id === id);
  if (!course) {
    container.innerHTML = `
      <section class="courses-page-header" style="margin-top:2rem;">
        <h1 class="section-title">The course was not found.</h1>
        <p class="section-subtitle">Maybe the link is wrong.</p>
        <a href="courses.html" class="btn btn-primary" style="margin-top:1rem;">
          Back to Courses
        </a>
      </section>`;
    return;
  }

const videoMeta = getCourseVideoMeta(course.id);

let videoHtml = "";

if (videoMeta) {
  if (videoMeta.youtubeId) {
    // YouTube embed
    videoHtml = `
      <aside class="video-card">
        <iframe
          src="https://www.youtube.com/embed/${videoMeta.youtubeId}"
          title="Course intro video"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </aside>
    `;
  } else if (videoMeta.src) {
    // Κανονικό .mp4
    videoHtml = `
      <aside class="video-card">
        <video 
          controls
          preload="metadata"
          src="${videoMeta.src}"
          ${videoMeta.poster ? `poster="${videoMeta.poster}"` : ""}
        ></video>
      </aside>
    `;
  }
}


  container.innerHTML = `
    <section class="courses-page-header" style="margin-top:2rem;">
      <div class="pill">
        <span class="pill-dot"></span>
        <span>${mapCategory(course.category)}</span>
      </div>

      <h1 class="section-title">${course.title}</h1>
      ${course.subtitle ? `<p class="section-subtitle">${course.subtitle}</p>` : ""}
    </section>

    <section class="course-details-grid">
      <article class="course-card">

        <div class="course-badges">
          ${course.level ? `<span class="course-badge">${course.level}</span>` : ""}
          ${course.popular ? `<span class="course-badge">Popular</span>` : ""}
          ${course.isNew ? `<span class="course-badge">New</span>` : ""}
        </div>

        <p class="section-subtitle" style="margin-top:0.75rem;">
          ${course.longDescription || course.shortDescription}
        </p>

        <div class="course-meta" style="margin-top:0.75rem;">
          ${course.duration ? `ᯓ★ ${course.duration}` : ""}
          ${course.lessonsCount ? `ᯓ★ ${course.lessonsCount} lessons` : ""}
          ${course.mode ? `ᯓ★ ${course.mode}` : ""}
        </div>

        <div class="course-actions" style="margin-top:1.25rem;">
          <a href="register.html" class="btn btn-primary">Register now!</a>
          ${course.rating ? `<span class="course-rating"><strong>★ ${course.rating}</strong> (${course.ratingCount})</span>` : ""}
        </div>
      </article>

      ${videoHtml}
    </section>
  `;
}





// =============================
// Courses list page
// =============================

function initCoursesPage() {
  if (!window.COURSES || !Array.isArray(window.COURSES)) {
    console.warn(" COURSES data not found. Έλεγξε το assets/js/data/courses.js");
    return;
  }

  const grid = document.getElementById("coursesGrid");
  const countEl = document.getElementById("coursesCount");
  const emptyEl = document.getElementById("coursesEmpty");

  if (!grid) {
    console.warn(" #coursesGrid δεν βρέθηκε στο DOM.");
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

    const category = categoryFilter?.value || "";
    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }

    const level = levelFilter?.value || "";
    if (level) {
      filtered = filtered.filter((c) => c.level === level);
    }

    const availability = availabilityFilter?.value || "";
    if (availability === "available") {
      filtered = filtered.filter((c) => c.available === true);
    }

    const language = languageFilter?.value || "";
    if (language) {
      filtered = filtered.filter((c) => c.language === language);
    }

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


      const metaHtml = metaParts.map((txt) => `<span>${txt}</span>`).join("");

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
            More...
          </button>
          ${ratingHtml}
        </div>
      `;

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
                Full details
              </a>
              <a href="register.html" class="btn">
                Register
              </a>
            </div>
          `);
        });
      }

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
  // ===========================
// Προεπιλεγμένο φίλτρο μέσω URL ?category=xxx
// ===========================
const urlParams = new URLSearchParams(window.location.search);
const urlCategory = urlParams.get("category");

// Αν υπάρχει ?category=..., συμπλήρωσε αυτόματα το dropdown
if (urlCategory) {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.value = urlCategory;
  }
}

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
