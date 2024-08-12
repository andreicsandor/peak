export function setupOptionButtonEvents() {
  const optionButtons = document.querySelectorAll(".option-button");
  const athleticismOutput = document.getElementById("athleticism-level");

  const defaultButton = document.querySelector(
    '.option-button[data-frequency="1"]'
  );
  if (defaultButton) {
    defaultButton.classList.add("active");
    athleticismOutput.textContent = "Slightly Athletic";
  }

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      optionButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const frequency = button.getAttribute("data-frequency");
      let athleticismText = "Not Athletic";

      switch (frequency) {
        case "0":
          athleticismText = "Not Athletic";
          break;
        case "1":
          athleticismText = "Slightly Athletic";
          break;
        case "2":
          athleticismText = "Moderately Athletic";
          break;
        case "3":
          athleticismText = "Athletic";
          break;
        case "4":
          athleticismText = "Very Athletic";
          break;
      }
      athleticismOutput.textContent = athleticismText;
    });
  });
}

export function setupDefaultValues() {
  const genderSelect = document.getElementById("gender");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");

  genderSelect.addEventListener("change", () => {
    if (genderSelect.value === "male") {
      weightInput.value = 70;
      heightInput.value = 175;
    } else if (genderSelect.value === "female") {
      weightInput.value = 60;
      heightInput.value = 165;
    } else {
      weightInput.value = "";
      heightInput.value = "";
    }
  });

  genderSelect.dispatchEvent(new Event("change"));
}

export function setupDatePicker() {
  document.addEventListener("DOMContentLoaded", function () {
    const birthdateInput = document.getElementById("birthdate");

    birthdateInput.addEventListener("focus", function () {
      this.type = "date";
      this.showPicker();
    });

    birthdateInput.addEventListener("change", function () {
      const date = new Date(this.value);
      if (!isNaN(date.getTime())) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        this.type = "text";
        this.value = formattedDate;
      }
    });

    birthdateInput.addEventListener("blur", function () {
      if (this.value === "") {
        this.type = "text";
      }
    });
  });
}

export function setupDeleteProfileEvent() {
  const deleteButton = document.getElementById("delete-profile-button");

  deleteButton.addEventListener("click", () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      // TO DO
    }
  });
}

export function setupUpdateProfileEvent() {
  const updateButton = document.getElementById("update-button");

  updateButton.addEventListener("click", () => {
    // TO DO
  });
}

export function setupLoginProfileEvent() {
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    navigateTo("/login");
  });
}
