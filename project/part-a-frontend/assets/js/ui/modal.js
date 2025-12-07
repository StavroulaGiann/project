

(function () {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");

  if (!modal) return;

  // Open modal with given HTML content
  window.openModal = function (html) {
    modalContent.innerHTML = html;
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // disable scroll
  };

  // Close modal
  window.closeModal = function () {
    modal.classList.remove("open");
    modalContent.innerHTML = "";
    document.body.style.overflow = "";
  };

  // Close on X click
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Close when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

})();
