export function addAthleticismLabel(frequency) {
  const athleticismOutput = document.getElementById("athleticism-level");
  let athleticismText = "Not Athletic";

  const frequencyStr = String(frequency);

  switch (frequencyStr) {
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
}

export function addDefaultBodyMetrics() {
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

export function setupOptionButtonEvents() {
  const optionButtons = document.querySelectorAll(".option-button");

  const activeButton = document.querySelector(".option-button.active");
  if (activeButton) {
    const frequency = activeButton.getAttribute("data-frequency");
    addAthleticismLabel(frequency);
  } else {
    const defaultButton = document.querySelector(
      '.option-button[data-frequency="1"]'
    );
    if (defaultButton) {
      defaultButton.classList.add("active");
      addAthleticismLabel("1");
    }
  }

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      optionButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const frequency = button.getAttribute("data-frequency");
      addAthleticismLabel(frequency);
    });
  });
}

export function setupLoginProfileEvent() {
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    navigateTo("/login");
  });
}
