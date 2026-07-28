/**
 * @file contact-form.js
 * @description Manages contact form validation, user interface feedback loops,
 * and asynchronous data payloads for serverless backend integration via Web3Forms.
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
    // Ignore hidden inputs (like botcheck honeypot or access_key) during field-level error checks
    if (
      inputElement.type === "hidden" ||
      inputElement.classList.contains("hidden")
    ) {
      return true;
    }

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

    // Build the form payload
    const formData = new FormData(form);

    // Silent anti-spam exit: If honeypot checkbox is checked, drop silently
    if (formData.get("botcheck")) {
      return;
    }

    const formPayload = Object.fromEntries(formData);
    const jsonFormPayload = JSON.stringify(formPayload);

    // Lock submit button to prevent double-submissions
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: jsonFormPayload,
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        alert("Thank you! Your message has been sent successfully.");
        form.reset();
        inputs.forEach((inputElement) => clearError(inputElement));
      } else {
        console.error("Web3Forms error response:", result);
        alert(
          result.message ||
            "An issue occurred during transmission. Please try again.",
        );
      }
    } catch (error) {
      console.error("Asynchronous transmission sequence failed:", error);
      alert(
        "Something went wrong. Please check your internet connection and try again.",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}
