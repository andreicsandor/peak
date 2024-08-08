import * as turf from "@turf/turf";
import { getDistanceBetweenPoints } from "./mathUtils.js";

let fetchedCoordinates = [];
let importedCoordinates = [];

export function setFetchedCoordinates(coordinates) {
  fetchedCoordinates = coordinates;
}

export function getFetchedCoordinates() {
  return fetchedCoordinates;
}

export function setImportedCoordinates(coordinates) {
  importedCoordinates = coordinates;
}

export function getImportedCoordinates() {
  return importedCoordinates;
}

export function clearCoordinates() {
  fetchedCoordinates = [];
  importedCoordinates = [];
}

// Resample a route to have a specific number of points
export function resampleRoute(coordinates, targetLength) {
  const transformedCoordinates = coordinates.map((coord) => [
    coord.lng,
    coord.lat,
  ]);
  const line = turf.lineString(transformedCoordinates);
  const totalLength = turf.length(line, { units: "kilometers" });
  const targetDistance = totalLength / (targetLength - 1);
  let resampledCoordinates = [];

  for (let i = 0; i < targetLength; i++) {
    const point = turf.along(line, targetDistance * i, { units: "kilometers" });
    resampledCoordinates.push({
      lng: point.geometry.coordinates[0],
      lat: point.geometry.coordinates[1],
    });
  }

  return resampledCoordinates;
}

// Compute the minimum distance between a point and all points in a route
function computeMinDistance(point, route) {
  let minDistance = Infinity;

  route.forEach((routePoint) => {
    const distance = getDistanceBetweenPoints(point, routePoint);
    if (distance < minDistance) {
      minDistance = distance;
    }
  });

  return minDistance;
}

// Generate heatmap data by calculating differences between two routes
export function generateHeatMapData(route1, route2) {
  const differences = route1
    .map((point1) => {
      const minDistance = computeMinDistance(point1, route2);

      return {
        type: "Feature",
        properties: {
          intensity: minDistance,
        },
        geometry: {
          type: "Point",
          coordinates: [point1.lng, point1.lat],
        },
      };
    })
    .filter((feature) => feature.properties.intensity > 0.0001);

  // Calculate maximum difference for dynamic threshold
  const maxDifference = Math.max(
    ...differences.map((feature) => feature.properties.intensity)
  );

  return {
    type: "FeatureCollection",
    features: differences,
    maxDifference, // Include maxDifference in the return object
  };
}

// Display the heatmap on the map
export function displayHeatMap(map, differencesGeoJSON, maxDifference) {
  if (map.getLayer("heatmap-layer")) {
    map.removeLayer("heatmap-layer");
  }

  if (map.getSource("heatmap-data")) {
    map.getSource("heatmap-data").setData(differencesGeoJSON);
  } else {
    map.addSource("heatmap-data", {
      type: "geojson",
      data: differencesGeoJSON,
    });

    map.addLayer({
      id: "heatmap-layer",
      type: "heatmap",
      source: "heatmap-data",
      minzoom: 14,
      maxzoom: 17.5,
      paint: {
        "heatmap-weight": {
          property: "intensity",
          type: "exponential",
          stops: [
            [0, 0],
            [maxDifference / 2, 1],
            [maxDifference, 3],
          ],
        },
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(255, 240, 240, 0)",
          0.2,
          "rgb(254, 224, 210)",
          0.4,
          "rgb(252, 187, 161)",
          0.6,
          "rgb(252, 146, 114)",
          0.8,
          "rgb(251, 106, 74)",
          1,
          "rgb(203, 24, 29)",
        ],
        "heatmap-radius": 20,
        "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          0,
          14,
          0.8,
          28,
          1,
        ],
      },
    });
  }
}

// Generate and display the heatmap data for the imported route and fetched route
export function generateAndDisplayHeatMap(map) {
  const { features, maxDifference } = generateHeatMapData(
    fetchedCoordinates,
    importedCoordinates
  );
  displayHeatMap(map, { type: "FeatureCollection", features }, maxDifference);
}

// Clear the heatmap from the map
export function clearHeatMap(map) {
  if (map.getLayer("heatmap-layer")) {
    map.removeLayer("heatmap-layer");
  }
  if (map.getSource("heatmap-data")) {
    map.removeSource("heatmap-data");
  }
}
