// AICANARY: CSD-ELearn-2025

(function () {
  console.log("✅ register-form.js loaded");

  const form = document.getElementById("registerForm");
  console.log("ℹ️ form element:", form);

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
    const password = formData.get("password") || "";
    const confirmPassword = formData.get("confirmPassword") || "";
    const role = formData.get("role");
    const interest = formData.get("interest");
    const terms = formData.get("termsAccepted");

    // First name
    if (!firstName) {
      setFieldError("firstName", "Το όνομα είναι υποχρεωτικό.");
      valid = false;
    }

    // Last name
    if (!lastName) {
      setFieldError("lastName", "Το επώνυμο είναι υποχρεωτικό.");
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setFieldError("email", "Δώσε ένα έγκυρο email.");
      valid = false;
    }

    // Password
    if (!isStrongPassword(password)) {
      setFieldError(
        "password",
        "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες, με ελληνικά ή λατινικά γράμματα και αριθμούς."
      );
      valid = false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
      setFieldError("confirmPassword", "Οι κωδικοί δεν ταιριάζουν.");
      valid = false;
    }

    // Role
    if (!role) {
      setFieldError("role", "Επίλεξε ρόλο χρήστη.");
      valid = false;
    }

    // Terms
    if (!terms) {
      setFieldError("terms", "Πρέπει να αποδεχτείς τους όρους χρήσης.");
      valid = false;
    }

    return { valid, formData };
  }

  // -------------------------------------
  // Modal summary
  // -------------------------------------

  function showSummaryModal(formData) {
    if (typeof window.openModal !== "function") {
      console.warn("⚠️ openModal δεν είναι διαθέσιμο.");
      if (statusEl) {
        statusEl.textContent =
          "Τα στοιχεία είναι έγκυρα. (Δεν βρέθηκε modal, αλλά σε παραγωγή θα εμφανίζεται σύνοψη.)";
      }
      return;
    }

    const firstName = (formData.get("firstName") || "").trim();
    const lastName = (formData.get("lastName") || "").trim();
    const email = (formData.get("email") || "").trim();
    const role = formData.get("role") || "";
    const interest = formData.get("interest") || "";

    const fullName = (firstName + " " + lastName).trim();

    const html = `
      <h2 class="modal-title">Επιβεβαίωση στοιχείων</h2>
      <div class="modal-body">
        <p>Έλεγξε τα στοιχεία σου πριν ολοκληρώσεις την εγγραφή:</p>
        <dl class="summary-list">
          <div class="summary-row">
            <dt>Ονοματεπώνυμο:</dt>
            <dd>${escapeHtml(fullName)}</dd>
          </div>
          <div class="summary-row">
            <dt>Email:</dt>
            <dd>${escapeHtml(email)}</dd>
          </div>
          <div class="summary-row">
            <dt>Ρόλος:</dt>
            <dd>${escapeHtml(role)}</dd>
          </div>
          <div class="summary-row">
            <dt>Περιοχή ενδιαφέροντος:</dt>
            <dd>${escapeHtml(interest)}</dd>
          </div>
        </dl>

        <div class="modal-actions" style="margin-top: 1.2rem; display: flex; gap: 0.6rem; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="modalConfirmRegister">
            Επιβεβαίωση εγγραφής
          </button>
          <button type="button" class="btn" id="modalEditRegister">
            Επιστροφή &amp; διόρθωση
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
          statusEl.textContent = "✔ Η εγγραφή ολοκληρώθηκε επιτυχώς!";
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
            "Μπορείς να διορθώσεις τα στοιχεία σου και να ξαναπατήσεις Συνέχεια.";
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
    console.log("📨 submit fired");

    const { valid, formData } = validateForm();

    if (!valid) {
      if (statusEl) {
        statusEl.textContent =
          "❌ Υπάρχουν λάθη. Διόρθωσέ τα για να συνεχίσεις.";
        statusEl.style.color = "#f97373"; // κόκκινο
      }
      return;
    }

    // SUCCESS → άνοιξε modal επιβεβαίωσης
    if (statusEl) {
      statusEl.textContent =
        "✅ Τα στοιχεία φαίνονται έγκυρα. Δες την προεπισκόπηση και επιβεβαίωσε.";
      statusEl.style.color = "";
    }

    showSummaryModal(formData);
  });
})();
