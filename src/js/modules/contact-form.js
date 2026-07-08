/**
 * @file contact.js
 * @description Manages contact form validation, user interface feedback loops,
 * and asynchronous data payloads for serverless backend integration.
 * @module modules/contact-form
 */

/**
 * Initializes the contact form sub-system module wrapper loop.
 * Sets up listeners for form validation recovery thresholds and master submission events.
 * @returns {void}
 */

export function initContactForm() {
  const form = document.querySelector("#contact-form");
  const submitBtn = document.querySelector("#contact-submit-btn");

  if (!form || !submitBtn) return;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Resets the visual danger UI feedback layer, restoring default brand themes.
   * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - Target node to clean.
   * @returns {void}
   */
  function clearError(inputElement) {
    const group = inputElement.closest(".form-control");
    const errorDisplay = group?.querySelector(".error-msg");

    inputElement.classList.remove(
      "border-red-500",
      "focus-visible:ring-red-500",
      "focus-visible:border-red-500",
    );
    inputElement.classList.add(
      "border-primary/20",
      "focus-visible:border-accent",
      "focus-visible:ring-1",
      "focus-visible:ring-accent",
    );

    if (errorDisplay) {
      errorDisplay.textContent = "";
      errorDisplay.classList.add("max-h-0", "opacity-0");
    }
  }

  /**
   * Applies luxury custom error typography and dynamic height layout transformations.
   * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - Target node causing the exception catch.
   * @param {string} message - Validation warning string text payload to print.
   * @returns {void}
   */

  function showError(inputElement, message) {
    const group = inputElement.closest(".form-control");
    const errorDisplay = group?.querySelector(".error-msg");

    inputElement.classList.remove(
      "border-primary/20",
      "focus-visible:border-accent",
      "focus-visible:ring-1",
      "focus-visible:ring-accent",
    );
    inputElement.classList.add(
      "border-red-500",
      "focus-visible:ring-red-500",
      "focus-visible:border-red-500",
    );

    if (errorDisplay) {
      errorDisplay.textContent = message;
      errorDisplay.classList.remove("max-h-0", "opacity-0");
      errorDisplay.classList.add("max-h-10", "opacity-100");
    }
  }

  /**
   * Validates an isolated input field element node against validation constraints.
   * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - The active node being assessed.
   * @returns {boolean} True if the element passes evaluation thresholds.
   */

  function isFieldValid(inputElement) {
    const value = inputElement.value.trim();

    if (inputElement.hasAttribute("required") && !value) {
      // Safely read the parent label text while stripping out the layout asterisks
      const rawLabelText =
        inputElement.labels?.[0]?.textContent?.trim() || "This field";

      const labelText = rawLabelText.replace("*", "").trim();

      const errorMessage = `${labelText} is required.`;
      showError(inputElement, errorMessage);
      return false;
    }

    if (inputElement.type === "email" && value && !emailRegex.test(value)) {
      const invalidEmailMessage = "Please enter a valid email address.";
      showError(inputElement, invalidEmailMessage);
      return false;
    }

    clearError(inputElement);
    return true;
  }

  // Real-Time Recovery Loop: Clear errors in real-time as the user types.
  form.querySelectorAll("input, textarea").forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      if (inputElement.classList.contains("border-red-500")) {
        isFieldValid(inputElement);
      }
    });
  });

  // Handle form submission intercept
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let isFormValid = true;
    const inputs = form.querySelectorAll("input, textarea");

    inputs.forEach((inputElement) => {
      if (!isFieldValid(inputElement)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) return;

    // Automated extraction of all form fields based on their HTML name attributes
    const formData = new FormData(form);
    const formPayload = Object.fromEntries(formData.entries());

    // Lock submit button to prevent double-submissions
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    try {
      console.log("Transmitting verified payload data block:", formPayload);

      // Simulation of network transmission latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Thank you! Your message has been sent successfully.");
      form.reset();
      inputs.forEach((inputElement) => clearError(inputElement)); // Clear UI styling residue
    } catch (error) {
      console.error("Asynchronous transmission sequence failed:", error);
      alert("An issue occurred during transmission. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}
