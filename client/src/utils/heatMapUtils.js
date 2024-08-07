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

// Find the closest intersection point to a specific point on the route
function findClosestIntersectionPoint(route1, route2, point) {
  const line1 = turf.lineString(route1.map((coord) => [coord.lng, coord.lat]));
  const line2 = turf.lineString(route2.map((coord) => [coord.lng, coord.lat]));

  const intersections = turf.lineIntersect(line1, line2);

  if (intersections.features.length > 0) {
    let closestPoint = null;
    let minDistance = Infinity;

    intersections.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const distance = getDistanceBetweenPoints({ lng, lat }, point);

      if (distance < minDistance) {
        closestPoint = feature;
        minDistance = distance;
      }
    });

    if (closestPoint) {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: closestPoint.geometry.coordinates,
        },
        properties: {},
      };
    }
  }
  return null;
}

// Find the closest point on a route to a given intersection point
function findClosestPointIndex(route, intersection) {
  let closestIndex = -1;
  let minDistance = Infinity;
  const [intersectionLng, intersectionLat] = intersection.geometry.coordinates;

  route.forEach((point, index) => {
    const distance = getDistanceBetweenPoints(
      { lng: point.lng, lat: point.lat },
      { lng: intersectionLng, lat: intersectionLat }
    );

    if (distance < minDistance) {
      closestIndex = index;
      minDistance = distance;
    }
  });

  return closestIndex;
}

// Generate heatmap data by calculating differences between two routes
export function generateHeatMapData(route1, route2) {
  const startPoint = route1[0];

  const startIntersection = findClosestIntersectionPoint(
    route1,
    route2,
    startPoint
  );

  if (startIntersection) {
    const startIndex1 = findClosestPointIndex(route1, startIntersection);
    const startIndex2 = findClosestPointIndex(route2, startIntersection);

    if (startIndex1 !== -1 && startIndex2 !== -1) {
      const subRoute1 = route1.slice(startIndex1);
      const subRoute2 = route2.slice(startIndex2);

      const targetLength = Math.max(subRoute1.length, subRoute2.length);
      const resampledRoute1 = resampleRoute(subRoute1, targetLength);
      const resampledRoute2 = resampleRoute(subRoute2, targetLength);

      const differences = resampledRoute1
        .map((point1, index) => {
          const point2 = resampledRoute2[index];
          const distance = getDistanceBetweenPoints(point1, point2);

          return {
            type: "Feature",
            properties: {
              intensity: distance,
            },
            geometry: {
              type: "Point",
              coordinates: [point1.lng, point1.lat],
            },
          };
        })
        .filter((feature) => feature.properties.intensity > 0.005);

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
  }

  return {
    type: "FeatureCollection",
    features: [],
    maxDifference: 0, // Default to 0 if no differences found
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
