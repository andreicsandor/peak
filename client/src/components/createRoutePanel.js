import { addMiniRoute } from "../utils/mapUtils.js";

export function createRoutePanel(route, importedRoute) {
  const contentMarkup = `
    <div class="map-wrapper minimised">
      <div class="map-container">
        <div id="map"></div>
      </div>
    </div>
  `;

  setTimeout(() => {    
    if (importedRoute) {
      addMiniRoute(route.geoCoordinates, importedRoute.geoCoordinates);
    } else {
      addMiniRoute(route.geoCoordinates, null);
    }
    
  }, 0);

  return contentMarkup;
}

export function resetRoutePanel() {
  const panelSection = document.querySelector(".panel-section");

  const contentMarkup = `
    <div id="panelHolder" class="panel-holder">
      <img src="./src/assets/compass-fill.svg" alt="Logo" style="margin-bottom: 20px">
      <h2 class="panel-section-message">View Your Routes</h2>
    </div>
    <div class="panel-loader hidden">
      <i class="fa-solid fa-map-location fa-fade fa-2xl" style="color: #c9c9d9;"></i>
    </div>
  `;

  panelSection.innerHTML = "";
  panelSection.innerHTML = contentMarkup;
}
