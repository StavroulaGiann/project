

(function () {
  console.log("register-form.js loaded");

  const form = document.getElementById("registerForm");
  console.log("form element:", form);

  if (!form) return;

  const statusEl = form.querySelector(".form-status");

  // -------------------------------------
  // Helpers
  // -------------------------------------

  function setFieldError(name, message) {
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (errorEl) {
      errorEl.textContent = message || "";
    }
  }

  function clearAllErrors() {
    form.querySelectorAll(".field-error").forEach((el) => {
      el.textContent = "";
    });

    if (statusEl) {
      statusEl.textContent = "";
      statusEl.style.color = ""; // reset χρώματος
    }
  }

  function isStrongPassword(value) {
    if (!value || value.length < 8) return false;

    // Λατινικά ΚΑΙ ελληνικά γράμματα
    const hasLetter = /[A-Za-zΑ-Ωα-ω]/.test(value);

    // Τουλάχιστον ένα ψηφίο
    const hasDigit = /\d/.test(value);

    return hasLetter && hasDigit;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

    function calculateAge(birthDateStr) {
    if (!birthDateStr) return null;

    const today = new Date();
    const birthDate = new Date(birthDateStr);

    if (isNaN(birthDate.getTime())) return null;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  // -------------------------------------
  // Validation
  // -------------------------------------

  function validateForm() {
    clearAllErrors();
    let valid = true;

    const formData = new FormData(form);

    const firstName = formData.get("firstName")?.trim();
    const lastName = formData.get("lastName")?.trim();
    const email = formData.get("email")?.trim();
    const birthDateStr = formData.get("birthDate");
    const age = calculateAge(birthDateStr);
    const password = formData.get("password") || "";
    const confirmPassword = formData.get("confirmPassword") || "";
    const role = formData.get("role");
    const interest = formData.get("interest");
    const terms = formData.get("termsAccepted");

    // First name
    if (!firstName) {
      setFieldError("firstName", "First Name is required");
      valid = false;
    }

    // Last name
    if (!lastName) {
      setFieldError("lastName", "Last Name is required.");
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setFieldError("email", "Please provide a valid email.");
      valid = false;
    }

    // Birthdate / Age
    if (!birthDateStr) {
      setFieldError("birthDate", "Birthdate is required.");
      valid = false;
    } else if (age === null || age < 15) {
      setFieldError("birthDate", "You must be at least 15 years old.");
      valid = false;
    }

    // Password
    if (!isStrongPassword(password)) {
      setFieldError(
        "password",
        "The password must be at least 8 characters long, with Greek or Latin letters and numbers.."
      );
      valid = false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
      setFieldError("confirmPassword", "Password mismatch");
      valid = false;
    }

    // Role
    if (!role) {
      setFieldError("role", "Choose user background");
      valid = false;
    }

    // Terms
    if (!terms) {
      setFieldError("terms", "This field is necessary");
      valid = false;
    }

    return { valid, formData };
  }

  // -------------------------------------
  // Modal summary
  // -------------------------------------

  function showSummaryModal(formData) {
    if (typeof window.openModal !== "function") {
      console.warn("openModal δεν είναι διαθέσιμο.");
      if (statusEl) {
        statusEl.textContent =
          "The data is valid. ";
      }
      return;
    }

    const firstName = (formData.get("firstName") || "").trim();
    const lastName = (formData.get("lastName") || "").trim();
    const birthDateStr = (formData.get("birthDate") || "").trim();
    const age = calculateAge(birthDateStr);
    const email = (formData.get("email") || "").trim();
    const role = formData.get("role") || "";
    const interest = formData.get("interest") || "";

    const fullName = (firstName + " " + lastName).trim();

    const html = `
      <h2 class="modal-title">Data Confimation</h2>
      <div class="modal-body">
        <p>Check your details before registration.:</p>
        <dl class="summary-list">
          <div class="summary-row">
            <dt>First / Last Name:</dt>
            <dd>${escapeHtml(fullName)}</dd>
          </div>
          <div class="summary-row">
            <dt>Birthdate / Age:</dt>
            <dd>${escapeHtml(birthDateStr)}${age != null ? " (" + age + " years)" : ""}</dd>
          </div>
          <div class="summary-row">
            <dt>Email:</dt>
            <dd>${escapeHtml(email)}</dd>
          </div>
          <div class="summary-row">
            <dt>Experience:</dt>
            <dd>${escapeHtml(role)}</dd>
          </div>
          <div class="summary-row">
            <dt>Area of interest:</dt>
            <dd>${escapeHtml(interest)}</dd>
          </div>
        </dl>

        <div class="modal-actions" style="margin-top: 1.2rem; display: flex; gap: 0.6rem; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="modalConfirmRegister">
            Confirm registration
          </button>
          <button type="button" class="btn" id="modalEditRegister">
           Go Back
          </button>
        </div>
      </div>
    `;

    window.openModal(html);

    const confirmBtn = document.getElementById("modalConfirmRegister");
    const editBtn = document.getElementById("modalEditRegister");

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        // Τελική "υποβολή" στον client
        if (statusEl) {
          statusEl.textContent = "Registration completed successfully!";
          statusEl.style.color = "#4ade80"; // πράσινο
        }

        // Προαιρετικά: καθάρισε localStorage draft, αν το χρησιμοποιείς
        try {
          localStorage.removeItem("devAcademyRegisterDraft");
        } catch (err) {
          console.warn("localStorage remove error:", err);
        }

        form.reset();
        if (typeof window.closeModal === "function") {
          window.closeModal();
        }
      });
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        if (typeof window.closeModal === "function") {
          window.closeModal();
        }
        if (statusEl) {
          statusEl.textContent =
            "You can correct your data and try again.";
          statusEl.style.color = "";
        }
      });
    }
  }

  // -------------------------------------
  // Submit Handler
  // -------------------------------------

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("submit fired");

    const { valid, formData } = validateForm();

    if (!valid) {
      if (statusEl) {
        statusEl.textContent =
          "Errors. Please correct them to continue.";
        statusEl.style.color = "#f97373"; // κόκκινο
      }
      return;
    }

    // SUCCESS → άνοιξε modal επιβεβαίωσης
    if (statusEl) {
      statusEl.textContent =
        "Valid data. View the preview and confirm.";
      statusEl.style.color = "";
    }

    showSummaryModal(formData);
  });
})();
