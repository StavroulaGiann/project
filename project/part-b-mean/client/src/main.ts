import "./styles.css";

type Course = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  level?: string;
  format?: string;
  durationWeeks?: number;
  language?: string;
};

async function loadCourses(): Promise<Course[]> {
  const res = await fetch("/api/courses");
  if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
  return res.json();
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function uniqueCategories(courses: Course[]) {
  const set = new Set<string>();
  for (const c of courses) if (c.category) set.add(c.category);
  return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
}

function renderCourseCard(c: Course) {
  const title = escapeHtml(c.title ?? "Untitled");
  const category = escapeHtml(c.category ?? "general");
  const desc = escapeHtml(c.description ?? "No description provided.");
  const level = escapeHtml(c.level ?? "beginner");
  const format = escapeHtml(c.format ?? "course");
  const lang = escapeHtml(c.language ?? "el");
  const weeks = typeof c.durationWeeks === "number" ? `${c.durationWeeks}w` : "—";

  return `
    <article class="card">
      <div class="card-top">
        <div>
          <h3>${title}</h3>
          <div class="meta">
            <span class="pill">#${category}</span>
            <span class="pill">${level}</span>
            <span class="pill">${format}</span>
            <span class="pill">${lang}</span>
            <span class="pill">${weeks}</span>
          </div>
        </div>
        <span class="badge">Preview</span>
      </div>
      <p class="desc">${desc}</p>
    </article>
  `;
}

async function main() {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  root.innerHTML = `
    <div class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <span class="logo"></span>
          <span>DevAcademy</span>
        </div>
        <span class="badge">Client (Vite + TS) • REST API</span>
      </div>
    </div>

    <div class="container">
      <section class="hero">
        <h1>E-Learning Courses</h1>
        <p>
          Courses are loaded dynamically from the backend (Express + MongoDB).
          This client has no hardcoded course data.
        </p>

        <div class="toolbar">
          <label class="input" aria-label="Search">
            🔎
            <input id="q" placeholder="Search by title..." />
          </label>

          <select id="cat" class="select" aria-label="Category">
            <option value="all">all</option>
          </select>

          <button id="reload" class="btn" type="button">↻ Reload</button>
        </div>

        <div class="footerNote" id="status">Loading…</div>
      </section>

      <section class="grid" id="grid"></section>

      <div class="empty" id="empty" style="display:none;">
        No courses yet. Add one in MongoDB (or create a POST /api/courses endpoint) and refresh.
      </div>

      <div class="errorBox" id="error" style="display:none;"></div>
    </div>
  `;

  const grid = document.querySelector<HTMLDivElement>("#grid")!;
  const status = document.querySelector<HTMLDivElement>("#status")!;
  const empty = document.querySelector<HTMLDivElement>("#empty")!;
  const error = document.querySelector<HTMLDivElement>("#error")!;
  const q = document.querySelector<HTMLInputElement>("#q")!;
  const cat = document.querySelector<HTMLSelectElement>("#cat")!;
  const reloadBtn = document.querySelector<HTMLButtonElement>("#reload")!;

  let allCourses: Course[] = [];

  function applyFilters() {
    const query = q.value.trim().toLowerCase();
    const category = cat.value;

    const filtered = allCourses.filter((c) => {
      const okCat = category === "all" || c.category === category;
      const okQ = !query || (c.title ?? "").toLowerCase().includes(query);
      return okCat && okQ;
    });

    grid.innerHTML = filtered.map(renderCourseCard).join("");
    empty.style.display = filtered.length === 0 ? "block" : "none";
  }

  async function loadAndRender() {
    error.style.display = "none";
    status.textContent = "Loading…";

    try {
      allCourses = await loadCourses();
      status.textContent = `Loaded ${allCourses.length} course(s)`;

      // categories dropdown
      const cats = uniqueCategories(allCourses);
      cat.innerHTML = cats.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");

      applyFilters();
    } catch (e: any) {
      status.textContent = "Error";
      error.style.display = "block";
      error.textContent = e?.message ?? "Unknown error";
      grid.innerHTML = "";
      empty.style.display = "none";
    }
  }

  q.addEventListener("input", applyFilters);
  cat.addEventListener("change", applyFilters);
  reloadBtn.addEventListener("click", loadAndRender);

  await loadAndRender();
}

main();
