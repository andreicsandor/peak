import toastr from "toastr";
import { fetchKeys } from "../api/maps/fetchMapKeys.js";
import { globalManager } from "../managers/globalManager.js";
import {
  activateMapControls,
  deactivateMapControls,
  showDashboard,
  showSimilarityScore,
} from "../utils/interfaceUtils.js";
import { addFetchedRoute, addImportedRoute } from "../utils/mapUtils.js";
import { removeMapLoader } from "./createLoader.js";
import { formatPace } from "../utils/interfaceUtils.js";
import { addPaceSelector } from "./createPaceSelector.js";
import { addSimilarityScore } from "./createSimilarityScore.js";
import { addWeatherWidget } from "./createWeatherControls.js";
import { fetchRoute, fetchImportRoutes } from "../api/routes/fetchRoutes.js";
import { Modes, setCurrentMode } from "../const/currentModes.js";
import { createRemoveButton } from "./createMapControls.js";
import { toastrOptions } from "../config/toastrConfig.js";
import {
  setFetchedCoordinates,
  getFetchedCoordinates,
  getImportedCoordinates,
  setImportedCoordinates,
} from "../utils/heatMapUtils.js";
import { parseWKTPoints } from "../utils/mapUtils.js";
import { generateAndDisplayHeatMap } from "../utils/heatMapUtils.js";

toastr.options = toastrOptions;

export async function addEmptyMap() {
  try {
    const { mapApiKey, metricsApiKey } = await fetchKeys();

    if (mapApiKey) {
      setTimeout(async () => {
        await globalManager.initializeMap(mapApiKey);
        globalManager.initializeManagers(mapApiKey, metricsApiKey);

        removeMapLoader();
        showDashboard();
        setupEventSubscriptions();
      }, 1000);
    } else {
      console.error("API keys are undefined.");
    }
  } catch (error) {
    console.error("Error fetching keys:", error);
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export async function addFetchedMap(routeId) {
  try {
    const { mapApiKey, metricsApiKey } = await fetchKeys();

    if (!routeId) {
      console.error("Route ID is missing.");
      return;
    }

    if (!mapApiKey) {
      console.error("API keys are undefined.");
      return;
    }

    try {
      const route = await fetchRoute(routeId);
      if (!route) {
        console.error("No route data available or failed to parse data.");
        return;
      }

      setTimeout(async () => {
        try {
          await globalManager.initializeMap(mapApiKey, route.geoCoordinates);
          globalManager.initializeManagers(mapApiKey, metricsApiKey);

          const { importManager, map } = globalManager.getManagers();

          removeMapLoader();
          showDashboard();
          deactivateMapControls();
          setupEventSubscriptions();

          await addFetchedRoute(route);

          setFetchedCoordinates(parseWKTPoints(route.geoCoordinates));

          const pace = formatPace(route.duration, route.distance);
          const [minutes, seconds] = pace
            .split("'")
            .map((p) => parseInt(p.replace("''", "")));

          addPaceSelector(minutes, seconds);
          addWeatherWidget(route.weatherMetrics);

          if (route.importedRouteId) {
            const importedRoute = await fetchImportRoutes(route.importedRouteId);
            if (importedRoute) {
              importManager.setImportedRoute(importedRoute);
              setCurrentMode(Modes.DEACTIVATED);
              addImportedRoute(importedRoute);

              setImportedCoordinates(
                parseWKTPoints(importedRoute.geoCoordinates)
              );
              generateAndDisplayHeatMap(
                map,
                getFetchedCoordinates(),
                getImportedCoordinates()
              );

              const compareButtonsContainer =
                document.querySelector(".compare-container");
              const uploadForm = document.getElementById("uploadForm");
              compareButtonsContainer.removeChild(uploadForm);
              const removeButton = createRemoveButton(compareButtonsContainer);
              compareButtonsContainer.append(removeButton);

              addSimilarityScore(route.percentageSimilarity);
              showSimilarityScore();
              
              deactivateMapControls();
            } else {
              console.error("Failed to fetch the imported route.");
            }
          } else {
            activateMapControls();
          }
        } catch (error) {
          console.error("Error initializing map or managers:", error);
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching or displaying the route:", error);
    }
  } catch (error) {
    console.error("Error fetching keys:", error);
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

function setupEventSubscriptions() {
  const {
    eventBus,
    routeManager,
    elevationManager,
    dashboardManager,
    stateManager,
  } = globalManager.getManagers();

  eventBus.subscribe("refreshRoute", async () => {
    await routeManager.computeRoute();
  });

  eventBus.subscribe("displayRoute", (routeData) => {
    elevationManager
      .computeRouteElevation(routeData.geometry.coordinates)
      .then((elevationGain) => {
        dashboardManager.displayRoute(routeData, elevationGain);
      })
      .catch((error) => {
        console.error("Failed to compute elevation gain:", error);
        dashboardManager.displayRoute(routeData, null);
      });
  });

  eventBus.subscribe("clearRoute", async () => {
    dashboardManager.clearRoute();
  });

  eventBus.subscribe("movedMarker", async (marker) => {
    stateManager.registerMoved(marker);
  });

  eventBus.subscribe("paceChanged", async (velocity) => {
    await routeManager.setVelocity(velocity);
  });
}
