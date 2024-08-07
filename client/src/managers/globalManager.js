import { ElevationManager } from "./elevationManager.js";
import { DashboardManager } from "./dashboardManager.js";
import { RouteManager } from "../managers/routeManager.js";
import { MarkerManager } from "../managers/markerManager.js";
import { StateManager } from "../managers/stateManager.js";
import { WeatherManager } from "../managers/weatherManager.js";
import { EventBus } from "../utils/eventBus.js";
import { setupMapbox, handleMapClick } from "../utils/mapUtils.js";
import { ImportManager } from "../managers/importManager.js";

let instance = null;

class GlobalManager {
  constructor() {
    if (!instance) {
      this.map = null;
      this.eventBus = null;
      this.elevationManager = null;
      this.stateManager = null;
      this.markerManager = null;
      this.routeManager = null;
      this.dashboardManager = null;
      this.weatherManager = new WeatherManager();
      this.importManager = null;

      instance = this;
    }

    return instance;
  }

  async initializeMap(mapApiKey, routeGeoCoordinates = null) {
    this.map = await setupMapbox(mapboxgl, mapApiKey, routeGeoCoordinates, "map");

    this.map.on("click", (event) => {
      handleMapClick(event);
    });
  }

  initializeManagers(mapApiKey, metricsApiKey) {
    this.eventBus = new EventBus();
    this.elevationManager = new ElevationManager(metricsApiKey);
    this.stateManager = new StateManager();
    this.markerManager = new MarkerManager(this.map, mapApiKey, this.eventBus);
    this.routeManager = new RouteManager(this.map, mapApiKey, this.eventBus);
    this.dashboardManager = new DashboardManager(this.map);
    this.importManager = new ImportManager();
  }

  getManagers() {
    return {
      eventBus: this.eventBus,
      elevationManager: this.elevationManager,
      stateManager: this.stateManager,
      markerManager: this.markerManager,
      routeManager: this.routeManager,
      dashboardManager: this.dashboardManager,
      weatherManager: this.weatherManager,
      importManager: this.importManager,
      map: this.map,
    };
  }
}

export const globalManager = new GlobalManager();
