import { fetchSuggestions } from "../api/maps/fetchSearchSuggestions.js";
import { fetchKeys } from "../api/maps/fetchMapKeys.js";
import { handleSearchLocation } from "../utils/mapUtils.js";
import { handleGetLocation } from "../utils/mapUtils.js";

export async function addLocationSearchBar() {
  try {
    const { mapApiKey } = await fetchKeys();

    if (mapApiKey) {
      const searchWrapper = document.querySelector(".dashboard-search-wrapper");

      const contentMarkup = `
        <div class="dashboard-search-container">
          <div class="search-bar">
            <input type="text" id="city-search-input" placeholder="Search">
              <button id="search-button"></button>
            </div>
            <div class="dashboard-location-wrapper hidden">
            </div>
          </div>
          <div id="suggestions-container" class="suggestions-container"></div>
          </div>
        </div>
      `;

      searchWrapper.innerHTML = contentMarkup;

      const searchInput = searchWrapper.querySelector("#city-search-input");
      const searchButton = searchWrapper.querySelector("#search-button");
      const suggestionsContainer = searchWrapper.querySelector(
        "#suggestions-container"
      );

      const handleSearchQuery = () => {
        const query = searchInput.value;
        handleSearchLocation(query);
      };

      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          handleSearchQuery();
        }
      });

      searchButton.addEventListener("click", handleSearchQuery);

      searchInput.addEventListener("input", async () => {
        const query = searchInput.value;
        if (query.length > 2) {
          const suggestions = await fetchSuggestions(query, mapApiKey);
          displaySuggestions(suggestions, suggestionsContainer, searchInput);
        } else {
          suggestionsContainer.innerHTML = "";
        }
      });
    } else {
      console.error("API keys are undefined.");
    }
  } catch (error) {
    console.error("Error fetching keys:", error);
  }
}

function displaySuggestions(suggestions, container, input) {
  container.innerHTML = "";
  suggestions.features.forEach((feature) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.textContent = feature.place_name;
    suggestionItem.addEventListener("click", () => {
      input.value = feature.place_name;
      container.innerHTML = "";
      handleSearchLocation(feature.place_name);
    });
    container.appendChild(suggestionItem);
  });
}

export async function addLocationButton() {
  try {
    const { mapApiKey } = await fetchKeys();

    if (mapApiKey) {
      const locationButtonWrapper = document.querySelector(".dashboard-location-wrapper");

      const contentMarkup = `
        <div class="dashboard-location-container">
          <button class="location-button">
            <img src="./src/assets/geo-fill.svg" alt="Logo">
          </button>
        </div>
      `;

      locationButtonWrapper.innerHTML = contentMarkup;

      const locationButton = locationButtonWrapper.querySelector(".location-button");

      const handleClick = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            handleGetLocation(longitude, latitude);
          }, (error) => {
            console.error("Error getting current location:", error);
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };

      locationButton.addEventListener("click", handleClick);

    } else {
      console.error("API keys are undefined.");
    }
  } catch (error) {
    console.error("Error fetching keys:", error);
  }
}
