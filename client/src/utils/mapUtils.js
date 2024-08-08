import toastr from "toastr";
import { importRoute } from "../api/importRoute.js";
import { uploadImportRoute } from "../api/createRoutes.js";
import { fetchKeys } from "../api/fetchMapKeys.js";
import { getUserLocation, setUserLocation } from "../const/userLocation.js";
import {
  LocationPermission,
  setLocationPermission,
} from "../const/locationPermission.js";
import { saveRoute } from "../api/createRoutes.js";
import { updateRoute } from "../api/updateRoute.js";
import { fetchLocation } from "../api/fetchLocation.js";
import { getDistanceBetweenCoordinates } from "./mathUtils.js";
import { globalManager } from "../managers/globalManager.js";
import {
  getCurrentMode,
  Modes,
  setCurrentMode,
} from "../const/currentModes.js";
import { addMapLoader, removeMapLoader } from "../components/createLoader.js";
import {
  clearSearchBar,
  hideMap,
  showMap,
  refreshWeatherWidget,
  hideSimilarityScore,
  showSimilarityScore,
} from "../utils/interfaceUtils.js";
import { RouteMetrics } from "../dto/routeMetricsDTO.js";
import { MarkerManager } from "../managers/markerManager.js";
import { deleteImportRoute, deleteRoute } from "../api/deleteRoutes.js";
import { toastrOptions } from "../config/toastrConfig";
import {
  setFetchedCoordinates,
  getFetchedCoordinates,
  setImportedCoordinates,
  getImportedCoordinates,
  generateAndDisplayHeatMap,
  clearHeatMap,
} from "./heatMapUtils.js";
import { addSimilarityScore } from "../components/createSimilarityScore.js";
import { WeatherMetrics } from "../dto/weatherMetricsDTO.js";
import { fetchTips } from "../api/fetchTips.js";
import { Route } from "../dto/routeDTO.js";
import { addAssistantOverlay } from "../components/createAssistantControls.js";

toastr.options = toastrOptions;

const DUPLICATE_PROXIMITY = 50;
const DELETE_PROXIMITY = 30;

function setupMap(mapboxgl, location) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/acsmapper/club7vb9x013m01mj91zo785e",
    center: location,
    zoom: 12,
    minZoom: 8,
  });

  const bounds = [
    [location[0] - 0.01, location[1] - 0.01],
    [location[0] + 0.01, location[1] + 0.01],
  ];

  map.on("load", () => {
    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 150, left: 150, right: 150 },
    });
  });

  return map;
}

export async function setupMapbox(mapboxgl, apiKey, routeGeoCoordinates) {
  mapboxgl.accessToken = apiKey;

  let location;

  if (routeGeoCoordinates) {
    const coordinates = parseWKTPoints(routeGeoCoordinates);
    const routeCoordinates = coordinates.map((point) => [point.lng, point.lat]);
    const middleIndex = Math.floor(routeCoordinates.length / 2);
    location = routeCoordinates[middleIndex];
    setUserLocation(location[0], location[1]);
  } else {
    location = getUserLocation();

    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setUserLocation(position.coords.longitude, position.coords.latitude);
        setLocationPermission(LocationPermission.LOCATION_ENABLED);
        location = getUserLocation();
      } catch (error) {
        console.error("Error getting user location", error);
        toastr.error("Oops, something went wrong.", "Error!");
        setLocationPermission(LocationPermission.LOCATION_DISABLED);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationPermission(LocationPermission.LOCATION_DISABLED);
    }
  }

  return setupMap(mapboxgl, location);
}

export async function addFetchedRoute(route) {
  const { markerManager, routeManager, eventBus } = globalManager.getManagers();

  if (route && route.waypoints) {
    const waypoints = parseWKTPoints(route.waypoints);

    const markers = waypoints.map(({ lng, lat }) => {
      const waypointToAdd = markerManager.createMarker({ lng, lat });
      markerManager.placeMarker(waypointToAdd);
      return waypointToAdd;
    });

    await routeManager.insertWaypoints(markers);

    setFetchedCoordinates(parseWKTPoints(route.geoCoordinates));
    eventBus.publish("refreshRoute");
  } else {
    console.error("No route data available or failed to parse data.");
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export function addImportedRoute(route) {
  const { markerManager, map } = globalManager.getManagers();

  const coordinates = parseWKTPoints(route.geoCoordinates);

  if (coordinates.length > 0) {
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];

    markerManager.startMarker = markerManager.createMarker(
      { lng: start.lng, lat: start.lat },
      MarkerManager.UPLOADED_COLOR
    );
    markerManager.endMarker = markerManager.createMarker(
      { lng: end.lng, lat: end.lat },
      MarkerManager.UPLOADED_COLOR
    );

    markerManager.placeMarker(markerManager.startMarker);
    markerManager.placeMarker(markerManager.endMarker);
  }

  const routeGeoJSON = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
    },
  };

  if (map.getSource("uploaded-route")) {
    map.getSource("uploaded-route").setData(routeGeoJSON);
  } else {
    map.addSource("uploaded-route", {
      type: "geojson",
      data: routeGeoJSON,
    });

    map.addLayer({
      id: "uploaded-route-layer",
      type: "line",
      source: "uploaded-route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#007cbf", "line-width": 4 },
    });
  }

  setImportedCoordinates(coordinates);
}

export function removeImportedRoute() {
  const { markerManager, map } = globalManager.getManagers();

  if (map.getLayer("uploaded-route-layer")) {
    map.removeLayer("uploaded-route-layer");
  }

  if (map.getSource("uploaded-route")) {
    map.removeSource("uploaded-route");
  }

  if (markerManager.startMarker) {
    markerManager.removeMarker(markerManager.startMarker);
    markerManager.startMarker = null;
  }

  if (markerManager.endMarker) {
    markerManager.removeMarker(markerManager.endMarker);
    markerManager.endMarker = null;
  }
}

export async function addMiniRoute(
  routeGeoCoordinates,
  importedGeoCoordinates
) {
  const { mapApiKey } = await fetchKeys();
  const mapElement = document.getElementById("map");

  const map = await setupMapbox(mapboxgl, mapApiKey, routeGeoCoordinates);

  const coordinates = parseWKTPoints(routeGeoCoordinates);
  const importedCoordinates = importedGeoCoordinates
    ? parseWKTPoints(importedGeoCoordinates)
    : null;
  const routeCoordinates = coordinates.map((point) => [point.lng, point.lat]);
  const importedRouteCoordinates = importedCoordinates
    ? importedCoordinates.map((point) => [point.lng, point.lat])
    : null;

  map.on("load", () => {
    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: routeCoordinates },
      },
    });

    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#ff7e5f", "line-width": 4 },
    });

    if (importedRouteCoordinates) {
      map.addSource("importedRoute", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: importedRouteCoordinates,
          },
        },
      });

      map.addLayer({
        id: "importedRoute",
        type: "line",
        source: "importedRoute",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007cbf", "line-width": 4 },
      });
    }

    const bounds = new mapboxgl.LngLatBounds();
    routeCoordinates.forEach((coord) => bounds.extend(coord));
    if (importedRouteCoordinates) {
      importedRouteCoordinates.forEach((coord) => bounds.extend(coord));
    }

    map.fitBounds(bounds, { padding: { top: 50 } });

    if (mapElement) {
      mapElement.mapInstance = map;
    }
  });
}

export async function handleMapClick(clickedPoint) {
  const currentMode = getCurrentMode();
  try {
    switch (currentMode) {
      case Modes.ADD_WAYPOINT:
        await addWaypoint(clickedPoint);
        break;
      case Modes.DUPLICATE_WAYPOINT:
        await duplicateWaypoint(clickedPoint);
        break;
      case Modes.DELETE_WAYPOINT:
        await deleteWaypoint(clickedPoint);
        break;
      case Modes.DEACTIVATED:
        break;
      default:
        throw new Error("Invalid mode");
    }
  } catch (error) {
    console.error("Error handling map click:", error);
  }
}

async function addWaypoint(clickedPoint) {
  const { routeManager, markerManager, stateManager } =
    globalManager.getManagers();

  const waypointToAdd = markerManager.createMarker(clickedPoint.lngLat);
  const isValid = await markerManager.snapMarker(waypointToAdd, "placed");
  if (!isValid) {
    toastr.info("Place waypoint closer to a walking path.");
    throw new Error("Failed to place a valid marker.");
  }

  if (globalManager.getManagers().routeManager.getWaypoints().length === 0) {
    const { lng, lat } = waypointToAdd.getLngLat();
    setUserLocation(lng, lat);
    refreshWeatherWidget();
  }

  stateManager.registerAdd(waypointToAdd);
  await routeManager.insertWaypoint(waypointToAdd);
  markerManager.placeMarker(waypointToAdd);
}

async function deleteWaypoint(clickedPoint) {
  const { routeManager, markerManager, stateManager } =
    globalManager.getManagers();

  const waypoints = routeManager.getWaypoints();
  const { waypoint, distance } = await getClosestWaypoint(
    clickedPoint.lngLat,
    waypoints
  );
  const waypointToDelete = waypoint;
  if (distance >= DELETE_PROXIMITY) {
    toastr.info("Clicked point too far from any waypoint.");
    throw new Error(
      "Clicked point too far from any waypoint to consider for deletion."
    );
  }
  const isValid = await markerManager.snapMarker(waypointToDelete, "placed");
  if (!isValid) {
    throw new Error("Failed to snap to a valid point for deletion.");
  }
  const previousWaypoint = routeManager.getWaypointBefore(waypointToDelete);
  stateManager.registerDelete(waypointToDelete, previousWaypoint);
  await routeManager.deleteWaypoint(waypointToDelete);
  markerManager.removeMarker(waypointToDelete);
}

async function duplicateWaypoint(clickedPoint) {
  const { routeManager, markerManager, stateManager } =
    globalManager.getManagers();

  const waypoints = routeManager.getWaypoints();
  const { waypoint: markerToDuplicate, distance } = await getClosestWaypoint(
    clickedPoint.lngLat,
    waypoints
  );

  if (distance > DUPLICATE_PROXIMITY) {
    toastr.info("Clicked point too far from any waypoint.");
    throw new Error("Distance exceeds duplication proximity.");
  }

  const duplicatedMarker = markerManager.createMarker(
    markerToDuplicate.getLngLat()
  );
  const isValid = await markerManager.snapMarker(duplicatedMarker, "placed");
  if (!isValid) {
    toastr.info("Couldn't duplicate waypoint.");
    throw new Error("Failed to snap marker at duplicate point.");
  }

  await stateManager.registerAdd(duplicatedMarker);
  await routeManager.insertWaypointAfter(duplicatedMarker, markerToDuplicate);
  markerManager.placeMarker(duplicatedMarker);
  markerManager.paintMarker(duplicatedMarker, MarkerManager.DUPLICATED_COLOR);
}

export async function getClosestWaypoint(pointCoordinates, waypoints) {
  let minimumDistance = Infinity;
  let closestWaypoint = null;

  waypoints.forEach((waypoint) => {
    const waypointCoordinates = waypoint.getLngLat();
    const distance = getDistanceBetweenCoordinates(
      pointCoordinates.lat,
      pointCoordinates.lng,
      waypointCoordinates.lat,
      waypointCoordinates.lng
    );

    if (distance < minimumDistance) {
      minimumDistance = distance;
      closestWaypoint = waypoint;
    }
  });

  return { waypoint: closestWaypoint, distance: minimumDistance };
}

export function parseWKTPoints(wktString) {
  const points = wktString.replace("LINESTRING (", "").replace(")", "");
  return points.split(", ").map((pair) => {
    const [lng, lat] = pair.trim().split(" ").map(Number);
    return { lng, lat };
  });
}

export async function handleSearchLocation(query) {
  try {
    const data = await fetchLocation(query);

    const { routeManager } = globalManager.getManagers();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;

      if (routeManager.getWaypoints().length === 0) {
        setUserLocation(lng, lat);
        refreshWeatherWidget();
      }

      globalManager.getManagers().map.flyTo({
        center: [lng, lat],
        essential: true,
        speed: 1.5,
        curve: 1.42,
        easing: (t) => t,
        duration: 2900,
      });
    } else {
      console.error("Location not found.");
    }
  } catch (error) {
    console.error("Error searching for city:", error);
    toastr.error("Oops, location not found!", "Error!");
  } finally {
    setTimeout(() => {
      addMapLoader();
      hideMap();
      clearSearchBar();

      setTimeout(() => {
        removeMapLoader();
        showMap();
      }, 2000);
    }, 150);
  }
}

export async function handleGetLocation(lng, lat) {
  try {
    if (lng && lat) {
      globalManager.getManagers().map.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true,
        speed: 1.5,
        curve: 1.42,
        easing: (t) => t,
        duration: 2900,
      });

      const { routeManager } = globalManager.getManagers();

      if (routeManager.getWaypoints().length === 0) {
        setUserLocation(lng, lat);
        refreshWeatherWidget();
      }
    } else {
      console.error("Location not found.");
    }
  } catch (error) {
    console.error("Error searching for city:", error);
    toastr.error("Oops, location not found!", "Error!");
  } finally {
    setTimeout(() => {
      addMapLoader();
      hideMap();

      setTimeout(() => {
        removeMapLoader();
        showMap();
      }, 2000);
    }, 150);
  }
}

export async function handleUndo() {
  const { routeManager, markerManager, stateManager } =
    globalManager.getManagers();
  const lastAction = stateManager.undoAction();
  if (lastAction) {
    switch (lastAction.type) {
      case "delete":
        await routeManager.insertWaypointAfter(
          lastAction.marker,
          lastAction.previousMarker
        );
        markerManager.placeMarker(lastAction.marker);
        break;
      case "add":
        await routeManager.deleteWaypoint(lastAction.marker);
        markerManager.removeMarker(lastAction.marker);
        break;
      case "move":
        await routeManager.updateWaypoint(lastAction.marker, lastAction.from);
        markerManager.placeMarker(lastAction.marker);
        break;
    }
  } else {
    toastr.info("No waypoints to undo.");
  }
}

export async function handleRedo() {
  const { routeManager, markerManager, stateManager } =
    globalManager.getManagers();
  const lastAction = stateManager.redoAction();
  if (lastAction) {
    switch (lastAction.type) {
      case "delete":
        await routeManager.deleteWaypoint(lastAction.marker);
        markerManager.removeMarker(lastAction.marker);
        break;
      case "add":
        await routeManager.insertWaypoint(lastAction.marker);
        markerManager.placeMarker(lastAction.marker);
        break;
      case "move":
        await routeManager.updateWaypoint(lastAction.marker, lastAction.to);
        markerManager.placeMarker(lastAction.marker);
        break;
    }
  } else {
    toastr.info("No waypoints to redo.");
  }
}

export async function handleSave() {
  const { routeManager, elevationManager, weatherManager } =
    globalManager.getManagers();
  const waypoints = routeManager.getWaypoints();
  const geoCoordinates = routeManager.getGeoCoordinates();

  const routeMetricsData = new RouteMetrics();
  routeMetricsData.distance = routeManager.getTotalDistance();
  routeMetricsData.duration = routeManager.getTotalDuration();
  routeMetricsData.elevationGain = elevationManager.getElevationGain();

  const weatherMetricsData = weatherManager.getWeatherMetricsData();
  weatherManager.clearWeatherMetricsData();
  const location = weatherManager.getWeatherForecastData().city.name;

  if (waypoints.length < 2) {
    toastr.info("Add at least two waypoints to define a route.");
    return;
  }

  const formattedWaypoints = waypoints.map((waypoint) => ({
    lng: waypoint.getLngLat().lng,
    lat: waypoint.getLngLat().lat,
  }));

  const formattedGeoCoordinates = geoCoordinates.map((geoCoordinate) => ({
    lng: geoCoordinate[0],
    lat: geoCoordinate[1],
  }));

  try {
    const data = await saveRoute(
      formattedWaypoints,
      formattedGeoCoordinates,
      routeMetricsData,
      weatherMetricsData,
      location
    );
    toastr.success("Route saved successfully.");
  } catch (error) {
    console.error("Failed to save the route:", error);
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export async function handleUpdate(id) {
  const { routeManager, elevationManager, weatherManager, importManager } =
    globalManager.getManagers();
  const waypoints = routeManager.getWaypoints();
  const geoCoordinates = routeManager.getGeoCoordinates();

  const routeMetricsData = new RouteMetrics();
  routeMetricsData.distance = routeManager.getTotalDistance();
  routeMetricsData.duration = routeManager.getTotalDuration();
  routeMetricsData.elevationGain = elevationManager.getElevationGain();

  const location = weatherManager.getWeatherForecastData().city.name;

  if (waypoints.length < 2) {
    toastr.info("Add at least two waypoints to define a route.");
    return;
  }

  const formattedWaypoints = waypoints.map((waypoint) => ({
    lng: waypoint.getLngLat().lng,
    lat: waypoint.getLngLat().lat,
  }));

  const formattedGeoCoordinates = geoCoordinates.map((geoCoordinate) => ({
    lng: geoCoordinate[0],
    lat: geoCoordinate[1],
  }));

  try {
    let importedRouteId = null;
    let percentageSimilarity = null;

    const removedRoute = importManager.popRemovedRoute();
    if (removedRoute && removedRoute.id) {
      try {
        await deleteImportRoute(removedRoute.id);
      } catch (error) {
        console.error(
          "Failed to delete the imported route from the backend:",
          error
        );
        throw new Error("Failed to delete the previously imported route.");
      }
    }

    const importRouteDTO = importManager.getImportedRoute();
    if (importRouteDTO) {
      weatherManager.clearWeatherMetricsData();
      const savedImportRoute = await uploadImportRoute(importRouteDTO);
      importedRouteId = savedImportRoute.id;
      percentageSimilarity = importManager.getPercentageSimilarity();
    }

    const weatherMetricsData = weatherManager.getWeatherMetricsData();
    weatherManager.clearWeatherMetricsData();

    const data = await updateRoute(
      id,
      formattedWaypoints,
      formattedGeoCoordinates,
      routeMetricsData,
      weatherMetricsData,
      location,
      importedRouteId,
      percentageSimilarity
    );

    toastr.success("Route updated successfully.");
  } catch (error) {
    console.error("Failed to update the route:", error);
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export async function handleDelete(routeId, importedRouteId) {
  try {
    if (importedRouteId) {
      await deleteImportRoute(importedRouteId);
    }
    await deleteRoute(routeId);

    return true;
  } catch (error) {
    console.error("Error deleting the route or imported route:", error);
    throw error;
  }
}

export async function handleImport(event) {
  event.preventDefault();

  const { importManager, map } = globalManager.getManagers();

  const file = document.getElementById("fileInput").files[0];
  const routeId = new URLSearchParams(window.location.search).get("id");

  if (!file) {
    console.error("No file selected.");
    toastr.info("Select a file to upload.");
    return { success: false };
  }

  try {
    const { routes, percentageSimilarity } = await importRoute(file, routeId);
    if (routes.length > 0) {
      const importedRoute = routes[0];
      importManager.setImportedRoute(importedRoute);
      setCurrentMode(Modes.DEACTIVATED);
      addImportedRoute(importedRoute);

      importManager.setPercentageSimilarity(percentageSimilarity);

      addSimilarityScore(percentageSimilarity);
      showSimilarityScore();

      generateAndDisplayHeatMap(
        map,
        getFetchedCoordinates(),
        getImportedCoordinates()
      );

      toastr.info("Activity imported successfully.");
      return { success: true };
    } else {
      console.error("No routes returned from the server.");
      toastr.error("Oops, something went wrong.", "Error!");
      return { success: false };
    }
  } catch (error) {
    console.error("Error:", error);
    toastr.error("Oops, something went wrong.", "Error!");
    return { success: false };
  }
}

export async function handleRemoveImport() {
  removeImportedRoute();
  setCurrentMode(Modes.ADD_WAYPOINT);
  globalManager.importManager.clearImportedRoute();
  clearHeatMap(globalManager.map);
  hideSimilarityScore();
  toastr.info("Imported activity removed.");
}

export async function handleAssistant() {
  const { routeManager, elevationManager, weatherManager } = globalManager.getManagers();
  const waypoints = routeManager.getWaypoints();
  const geoCoordinates = routeManager.getGeoCoordinates();

  const routeMetricsData = new RouteMetrics();
  routeMetricsData.distance = routeManager.getTotalDistance();
  routeMetricsData.duration = routeManager.getTotalDuration();
  routeMetricsData.elevationGain = elevationManager.getElevationGain();

  const weatherMetricsData = weatherManager.getWeatherMetricsData();
  const location = weatherManager.getWeatherForecastData().city.name;

  if (waypoints.length < 2) {
    toastr.info("Add at least two waypoints to define a route.");
    return;
  }

  const formattedWaypoints = JSON.stringify(waypoints.map((waypoint) => ({
    lng: waypoint.getLngLat().lng,
    lat: waypoint.getLngLat().lat,
  })));

  const formattedGeoCoordinates = JSON.stringify(geoCoordinates.map((geoCoordinate) => ({
    lng: geoCoordinate[0],
    lat: geoCoordinate[1],
  })));

  const routeData = new Route({
    name: "My Route",
    waypoints: formattedWaypoints,
    geoCoordinates: formattedGeoCoordinates,
    distance: routeMetricsData.distance,
    duration: routeMetricsData.duration,
    elevationGain: routeMetricsData.elevationGain,
    weatherMetrics: weatherMetricsData ? new WeatherMetrics(weatherMetricsData) : new WeatherMetrics(),
    location: location,
  });

  try {
    toastr.info("Getting tips for your run...", "Assistant");
    const data = await fetchTips(routeData);
    addAssistantOverlay(data.recommendation);
  } catch (error) {
    toastr.error("Oops, something went wrong.", "Error!");
  }
}
