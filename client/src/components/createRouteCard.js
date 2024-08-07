import toastr from "toastr";
import { addPanelLoader, addRoutesLoader, removePanelLoader, removeRoutesLoader } from "./createLoader";
import { fetchRoute, fetchImportRoutes } from "../api/fetchRoutes";
import { createRoutePanel, resetRoutePanel } from "./createRoutePanel";
import { createWeatherSummary } from "./createWeatherSummary";
import { formatDistance, formatElevation, formatPace, formatTime } from "../utils/interfaceUtils";
import { toastrOptions } from "../config/toastrConfig";
import { handleDelete } from "../utils/mapUtils";
import { createSimilaritySummary } from "./createSimilaritySummary";

toastr.options = toastrOptions;

export function createRouteCard(route) {
  const routeCard = document.createElement("div");

  const date = new Date(route.createdTime);
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);

  const distanceDisplay = formatDistance(route.distance);
  const elevationDisplay = formatElevation(route.elevationGain);

  const scheduledMarkup = route.weatherMetrics.scheduledTime !== null
    ? `<img class="icon-badge" src="./src/assets/calendar2-event-fill.svg" alt="Logo">`
    : '';

  const badgeMarkup = route.percentageSimilarity !== null
    ? `<img class="icon-badge" src="./src/assets/patch-check-fill.svg" alt="Logo">`
    : '';

  const contentMarkup = `
    <div class="route-card" id="route-card-${route.id}">
      <div class="card-body">
        <div class="route-header">
          <header>
            <p class="route-date">${formattedDate}</p>
            <h2 class="route-title">${route.name}</h2>
            <p class="route-date">${route.location}</p>
          </header>
          <div class="button-group">
            ${scheduledMarkup}
            ${badgeMarkup}
            <button href="#" class="update-button">
              <img src="./src/assets/pencil-fill.svg" alt="Logo">
            </button>
            <button href="#" class="delete-button" data-route-id="${route.id}">
              <img src="./src/assets/trash-fill.svg" alt="Logo">
            </button>
          </div>
        </div>
        <div class="route-information">
          <div class="route-metrics">
            <div class="metric">
              <span class="metric-value">${distanceDisplay.value}</span>
              <p class="metric-label">${distanceDisplay.unit}</p>
            </div>
            <div class="metric">
              <span class="metric-value">${formatPace(route.duration, route.distance)}</span>
              <p class="metric-label">Avg. Pace</p>
            </div>
            <div class="metric">
              <span class="metric-value">${formatTime(route.duration)}</span>
              <p class="metric-label">Time</p>
            </div>
            <div class="metric">
              <span class="metric-value">${elevationDisplay.value}</span>
              <p class="metric-label">${elevationDisplay.unit}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  routeCard.innerHTML = contentMarkup;

  attachRouteEvents(routeCard, route);

  return routeCard;
}

export async function deleteRouteHandler(route, routeCardElement) {
  const routeId = route.id;

  const isConfirmed = confirm("Are you sure you want to delete this route?");
  if (!isConfirmed) {
    return;
  }

  const listContainer = document.querySelector(".routes");
  listContainer.classList.add("hidden");

  addRoutesLoader();

  try {
    await handleDelete(routeId, route.importedRouteId);

    toastr.success("Route has been deleted.");
    routeCardElement.remove();
  } catch (error) {
    toastr.error("Oops, something went wrong.", "Error!");
    throw error;
  } finally {
    setTimeout(() => {
      removeRoutesLoader();
      resetRoutePanel();
      listContainer.classList.remove("hidden");
    }, 500);
  }
}

function clickRouteHandler(route) {
  const panelHolder = document.querySelector("#panelHolder");
  panelHolder.classList.add("hidden");

  addPanelLoader();

  fetchRoute(route.id)
    .then(async (route) => {
      if (route) {
        panelHolder.classList.remove("panel-holder");
        panelHolder.classList.add("mini-map-holder");

        let importedRoute = null;

        if (route.importedRouteId) {
          importedRoute = await fetchImportRoutes(route.importedRouteId);
        }

        panelHolder.innerHTML = createRoutePanel(route, importedRoute);

        if (route.weatherMetrics && route.weatherMetrics.scheduledTime != null) {
          const weatherWidget = createWeatherSummary(route.location, route.weatherMetrics);
          panelHolder.appendChild(weatherWidget);
        }

        if (route.percentageSimilarity != null) {
          const similarityWidget = createSimilaritySummary(route);
          panelHolder.appendChild(similarityWidget);
        }
        
        setTimeout(() => {
          const mapElement = document.getElementById("map");
          if (mapElement && mapElement.mapInstance) {
            mapElement.mapInstance.resize();
          }
        }, 501);
      } else {
        console.error("Route data is empty.");
      }
    })
    .catch((error) => {
      console.error("Error fetching route data:", error);
      toastr.error("Oops, something went wrong.", "Error!");
    })
    .finally(() => {
      setTimeout(() => {
        removePanelLoader();
        panelHolder.classList.remove("hidden");
      }, 500);
    });
}

function attachRouteEvents(routeCard, route) {
  const deleteButton = routeCard.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    deleteRouteHandler(route, routeCard);
  });

  const updateButton = routeCard.querySelector(".update-button");
  updateButton.addEventListener("click", function () {
    redirectToEditPage(route.id);
  });

  routeCard.addEventListener("click", function () {
    clickRouteHandler(route);
  });
}

function redirectToEditPage(routeId) {
  const url = new URL(window.location.origin);
  url.pathname = '/edit';
  url.searchParams.set('id', routeId);
  window.location.href = url.toString();
}
