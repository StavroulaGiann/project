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

    // Interest
    if (!interest) {
      setFieldError("interest", "Επίλεξε περιοχή ενδιαφέροντος.");
      valid = false;
    }

    // Terms
    if (!terms) {
      setFieldError("terms", "Πρέπει να αποδεχτείς τους όρους χρήσης.");
      valid = false;
    }

    return valid;
  }

  // -------------------------------------
  // Submit Handler
  // -------------------------------------

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("📨 submit fired");

    const ok = validateForm();

    // FAILED
    if (!ok) {
      if (statusEl) {
        statusEl.textContent = "❌ Υπάρχουν λάθη. Διόρθωσέ τα για να συνεχίσεις.";
        statusEl.style.color = "#f97373"; // κόκκινο
      }
      return;
    }

    // SUCCESS
    if (statusEl) {
      statusEl.textContent = "✔ Η εγγραφή ολοκληρώθηκε επιτυχώς!";
      statusEl.style.color = "#4ade80"; // απαλό πράσινο
    }
  });

})();
