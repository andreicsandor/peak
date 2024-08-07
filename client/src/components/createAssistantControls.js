import { typeText } from "../utils/interfaceUtils";

export function addAssistantOverlay(recommendation) {
  const overlay = document.getElementById("dashboard-assistant-overlay");
  overlay.innerHTML = `
      <div class="overlay-header">
        <button href="#" class="control-button" id="close-assistant-overlay">
          <img src="./src/assets/x.svg" alt="Close">
        </button>
        <p class="tips-heading">Tips</p>
      </div>
      <div class="overlay-recommendation">
        <p class="recommendation-text" id="recommendation-text"></p>
      </div>
    `;

  document
    .querySelector("#close-assistant-overlay")
    .addEventListener("click", () => {
      overlay.style.display = "none";
    });

  overlay.style.display = "block";

  const recommendationElement = document.getElementById("recommendation-text");
  typeText(recommendationElement, recommendation);
}
