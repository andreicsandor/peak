import {
  getLocationPermission,
  LocationPermission,
} from "../const/locationPermission";
import { createRouteCard } from "../components/createRouteCard";
import { addWeatherWidget } from "../components/createWeatherControls";

export const addRouteCards = async (routes) => {
  const activityContainer = document.querySelector(".routes");

  const mainMessage = document.createElement("h2");
  mainMessage.className = "main-message";
  mainMessage.innerText = "No routes available";

  activityContainer.innerHTML = "";
  activityContainer.appendChild(mainMessage);

  if (routes.length) {
    activityContainer.innerHTML = "";

    for (let route of routes) {
      activityContainer.appendChild(createRouteCard(route));
    }
  }
};

export function activateMapControls() {
  const actionWrapper = document.querySelector(".action-container");
  if (actionWrapper) {
    actionWrapper.style.pointerEvents = "auto";
    actionWrapper.classList.remove("hidden");
  }

  const stateWrapper = document.querySelector(".state-container");
  if (stateWrapper) {
    stateWrapper.style.pointerEvents = "auto";
    stateWrapper.classList.remove("hidden");
  }

  const assistantWrapper = document.querySelector(".assistant-container");
  if (assistantWrapper) {
    assistantWrapper.style.pointerEvents = "auto";
    assistantWrapper.classList.remove("hidden");
  }

  const searchWrapper = document.querySelector(".dashboard-search-wrapper");
  if (searchWrapper) {
    searchWrapper.classList.remove("hidden");
  }

  const locationButtonWrapper = document.querySelector(
    ".dashboard-location-wrapper"
  );
  if (locationButtonWrapper) {
    locationButtonWrapper.classList.remove("hidden");
  }

  const weatherButtonWrapper = document.querySelector(
    ".dashboard-weather-wrapper"
  );
  if (weatherButtonWrapper) {
    weatherButtonWrapper.classList.remove("hidden");
  }

  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");
  if (paceWrapper) {
    paceWrapper.style.pointerEvents = "auto";
  }

  const uploadForm = document.querySelector("#uploadForm");
  if (uploadForm) {
    uploadForm.style.pointerEvents = "auto";
    uploadForm.classList.remove("hidden");
  }
}

export function deactivateMapControls() {
  const actionWrapper = document.querySelector(".action-container");
  if (actionWrapper) {
    actionWrapper.style.pointerEvents = "none";
    actionWrapper.classList.add("hidden");
  }

  const stateWrapper = document.querySelector(".state-container");
  if (stateWrapper) {
    stateWrapper.style.pointerEvents = "none";
    stateWrapper.classList.add("hidden");
  }

  const assistantWrapper = document.querySelector(".assistant-container");
  if (assistantWrapper) {
    assistantWrapper.style.pointerEvents = "none";
    assistantWrapper.classList.add("hidden");
  }

  const searchWrapper = document.querySelector(".dashboard-search-wrapper");
  if (searchWrapper) {
    searchWrapper.classList.add("hidden");
  }

  const locationButtonWrapper = document.querySelector(
    ".dashboard-location-wrapper"
  );
  if (locationButtonWrapper) {
    locationButtonWrapper.classList.add("hidden");
  }

  const weatherButtonWrapper = document.querySelector(
    ".dashboard-weather-wrapper"
  );
  if (weatherButtonWrapper) {
    weatherButtonWrapper.classList.add("hidden");
  }

  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");
  if (paceWrapper) {
    paceWrapper.style.pointerEvents = "none";
  }

  const uploadForm = document.querySelector("#uploadForm");
  if (uploadForm) {
    uploadForm.style.pointerEvents = "none";
    uploadForm.classList.add("hidden");
  }
}

export function showMap() {
  const mapWrapper = document.querySelector(".map-container");
  if (mapWrapper) {
    mapWrapper.classList.remove("hidden");
  }
}

export function hideMap() {
  const mapWrapper = document.querySelector(".map-container");
  if (mapWrapper) {
    mapWrapper.classList.add("hidden");
  }
}

export function activateDashboardControls() {
  const map = document.querySelector("#map");
  if (map) {
    map.style.pointerEvents = "auto";
    map.style.opacity = "1";
  }

  const entityWrapper = document.querySelector(".entity-container");
  if (entityWrapper) {
    entityWrapper.style.pointerEvents = "auto";
  }

  const actionWrapper = document.querySelector(".action-container");
  if (actionWrapper) {
    actionWrapper.style.pointerEvents = "auto";
  }

  const stateWrapper = document.querySelector(".state-container");
  if (stateWrapper) {
    stateWrapper.style.pointerEvents = "auto";
  }

  const assistantWrapper = document.querySelector(".assistant-container");
  if (assistantWrapper) {
    assistantWrapper.style.pointerEvents = "auto";
  }

  const infoWrapper = document.querySelector(".dashboard-info-wrapper");
  if (infoWrapper) {
    infoWrapper.classList.remove("hidden");
  }

  const searchWrapper = document.querySelector(".dashboard-search-wrapper");
  if (searchWrapper) {
    searchWrapper.classList.remove("hidden");
  }

  const locationButtonWrapper = document.querySelector(
    ".dashboard-location-wrapper"
  );
  if (locationButtonWrapper) {
    locationButtonWrapper.classList.remove("hidden");
  }

  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");
  if (paceWrapper) {
    paceWrapper.classList.remove("hidden");
  }

  const compareWrapper = document.querySelector(".dashboard-compare-wrapper");
  if (compareWrapper) {
    compareWrapper.classList.remove("hidden");
  }
}

export function deactivateDashboardControls() {
  const map = document.querySelector("#map");
  if (map) {
    map.style.pointerEvents = "none";
    map.style.opacity = "0.4";
  }

  const entityWrapper = document.querySelector(".entity-container");
  if (entityWrapper) {
    entityWrapper.style.pointerEvents = "none";
  }

  const actionWrapper = document.querySelector(".action-container");
  if (actionWrapper) {
    actionWrapper.style.pointerEvents = "none";
  }

  const stateWrapper = document.querySelector(".state-container");
  if (stateWrapper) {
    stateWrapper.style.pointerEvents = "none";
  }

  const assistantWrapper = document.querySelector(".assistant-container");
  if (assistantWrapper) {
    assistantWrapper.style.pointerEvents = "none";
  }

  const infoWrapper = document.querySelector(".dashboard-info-wrapper");
  if (infoWrapper) {
    infoWrapper.classList.add("hidden");
  }

  const searchWrapper = document.querySelector(".dashboard-search-wrapper");
  if (searchWrapper) {
    searchWrapper.classList.add("hidden");
  }

  const locationButtonWrapper = document.querySelector(
    ".dashboard-location-wrapper"
  );
  if (locationButtonWrapper) {
    locationButtonWrapper.classList.add("hidden");
  }

  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");
  if (paceWrapper) {
    paceWrapper.classList.add("hidden");
  }

  const compareWrapper = document.querySelector(".dashboard-compare-wrapper");
  if (compareWrapper) {
    compareWrapper.classList.add("hidden");
  }
}

export function showDashboard() {
  const menuWrapper = document.querySelector(".dashboard-menu-wrapper");
  if (menuWrapper) {
    menuWrapper.classList.remove("hidden");
  }

  const searchWrapper = document.querySelector(".dashboard-search-wrapper");
  if (searchWrapper) {
    searchWrapper.classList.remove("hidden");
  }

  const locationButtonWrapper = document.querySelector(
    ".dashboard-location-wrapper"
  );
  const locationPermission = getLocationPermission();
  if (
    locationButtonWrapper &&
    locationPermission == LocationPermission.LOCATION_ENABLED
  ) {
    locationButtonWrapper.classList.remove("hidden");
  }

  const weatherWrapper = document.querySelector(".dashboard-weather-wrapper");
  if (weatherWrapper) {
    weatherWrapper.classList.remove("hidden");
  }

  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");
  if (paceWrapper) {
    paceWrapper.classList.remove("hidden");
  }

  const compareWrapper = document.querySelector(".dashboard-compare-wrapper");
  if (compareWrapper) {
    compareWrapper.classList.remove("hidden");
  }
}

export function hideDashboard() {
  const menuWrapper = document.querySelector(".dashboard-menu-wrapper");
  if (menuWrapper) {
    menuWrapper.classList.add("hidden");
  }

  const searchWrapper = document.querySelector(".dashboard-search-wrapper");
  if (searchWrapper) {
    searchWrapper.classList.add("hidden");
  }

  const locationButtonWrapper = document.querySelector(
    ".dashboard-location-wrapper"
  );
  if (locationButtonWrapper) {
    locationButtonWrapper.classList.add("hidden");
  }

  const weatherWrapper = document.querySelector(".dashboard-weather-wrapper");
  if (weatherWrapper) {
    weatherWrapper.classList.add("hidden");
  }

  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");
  if (paceWrapper) {
    paceWrapper.classList.add("hidden");
  }

  const compareWrapper = document.querySelector(".dashboard-compare-wrapper");
  if (compareWrapper) {
    compareWrapper.classList.add("hidden");
  }
}

export function showSimilarityScore() {
  const similarityWrapper = document.querySelector(
    ".dashboard-similarity-wrapper"
  );
  if (similarityWrapper) {
    similarityWrapper.classList.remove("hidden");
  }
}

export function hideSimilarityScore() {
  const similarityWrapper = document.querySelector(
    ".dashboard-similarity-wrapper"
  );
  if (similarityWrapper) {
    similarityWrapper.classList.add("hidden");
  }
}

export function refreshWeatherWidget() {
  addWeatherWidget();
}

export function clearSearchBar() {
  const searchInput = document.querySelector("#city-search-input");
  const suggestionsContainer = document.querySelector("#suggestions-container");
  if (searchInput) {
    searchInput.value = "";
  }
  if (suggestionsContainer) {
    suggestionsContainer.innerHTML = "";
  }
}

export function formatPace(duration, distance) {
  const paceSecondsPerMeter = duration / distance;
  const paceSecondsPerKilometer = paceSecondsPerMeter * 1000;
  const minutes = Math.floor(paceSecondsPerKilometer / 60);
  const seconds = Math.ceil(paceSecondsPerKilometer % 60);
  return `${minutes}'${seconds < 10 ? "0" : ""}${seconds}''`;
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds.toFixed(0)}`;
}

export function formatDistance(distance) {
  if (distance < 1000) {
    return { value: distance.toFixed(0), unit: "Meters" };
  } else if (distance === 1000) {
    return { value: distance.toFixed(0), unit: "Kilometer" };
  } else {
    return { value: (distance / 1000).toFixed(1), unit: "Kilometers" };
  }
}

export function formatElevation(elevationGain) {
  if (elevationGain < 1000) {
    return { value: `${elevationGain.toFixed(0)} m`, unit: "Elevation" };
  } else if (elevationGain === 1000) {
    return { value: `${elevationGain.toFixed(0)} km`, unit: "Elevation" };
  } else {
    return {
      value: `${(elevationGain / 1000).toFixed(1)} km`,
      unit: "Elevation",
    };
  }
}

export function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function typeText(element, text, delay = 20) {
  let i = 0;
  const typingIndicator = document.createElement("span");
  typingIndicator.classList.add("typing-indicator");
  element.appendChild(typingIndicator);

  const intervalId = setInterval(() => {
    if (i < text.length) {
      element.insertBefore(document.createTextNode(text.charAt(i)), typingIndicator);
      i++;
    } else {
      clearInterval(intervalId);
      typingIndicator.remove();
    }
  }, delay);
}

export function formatDatePicker() {
  const birthdateInput = document.getElementById("birthdate");

  if (!birthdateInput) return;

  if (birthdateInput.value) {
    const date = new Date(birthdateInput.value);
    if (!isNaN(date.getTime())) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      birthdateInput.value = date.toLocaleDateString("en-US", options);
    }
  }

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
}

export function validateNumericInput() {
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");

  function enforceValidInput(input) {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9.]/g, "");
      if (this.value.split(".").length > 2) {
        this.value = this.value.substring(0, this.value.length - 1);
      }
    });
  }

  function enforceValidRange(input, min, max) {
    input.addEventListener("blur", function () {
      if (this.value !== "") {
        const value = parseFloat(this.value);
        if (value < min) {
          this.value = min;
        } else if (value > max) {
          this.value = max;
        }
      }
    });
  }

  enforceValidInput(weightInput);
  enforceValidInput(heightInput);

  enforceValidRange(weightInput, 30, 200);
  enforceValidRange(heightInput, 100, 250);
}
