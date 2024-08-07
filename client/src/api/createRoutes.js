import { Route } from "../dto/routeDTO";
import { ImportRoute } from "../dto/importRouteDTO";
import { RouteMetrics } from "../dto/routeMetricsDTO";
import { WeatherMetrics } from "../dto/weatherMetricsDTO";
import { getAuthHeader } from "../utils/authUtils";
import { API_ROUTES_URL } from "../config";

export async function saveRoute(
  waypoints,
  coordinates,
  routeMetricsData,
  weatherMetricsData,
  location
) {
  const waypointsWKT = `LINESTRING (${waypoints
    .map((waypoint) => `${waypoint.lng} ${waypoint.lat}`)
    .join(", ")})`;

  const coordinatesWKT = `LINESTRING (${coordinates
    .map((coordinate) => `${coordinate.lng} ${coordinate.lat}`)
    .join(", ")})`;

  const routeMetrics = new RouteMetrics(routeMetricsData);

  const distance = routeMetrics.distance;
  const elevationGain = routeMetrics.elevationGain;
  const duration = routeMetrics.duration;

  const weatherMetrics = weatherMetricsData
    ? new WeatherMetrics(weatherMetricsData)
    : new WeatherMetrics();

  const routeName = weatherMetricsData?.timePeriod
    ? `${weatherMetricsData.timePeriod
        .charAt(0)
        .toUpperCase()}${weatherMetricsData.timePeriod.slice(1)} Activity`
    : "Planned Activity";

  const route = new Route({
    name: routeName,
    waypoints: waypointsWKT,
    geoCoordinates: coordinatesWKT,
    distance: distance,
    duration: duration,
    elevationGain: elevationGain,
    weatherMetrics: weatherMetrics,
    location: location,
  });

  try {
    const response = await fetch(`${API_ROUTES_URL}/save-route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(route),
    });

    if (!response.ok) {
      throw new Error("Failed to save route.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving the route:", error);
    throw new Error("Failed to create route");
  }
}

export async function uploadImportRoute(importRoute) {
  const route = new ImportRoute({
    name: importRoute.name || "Imported Route",
    waypoints: importRoute.waypoints,
    geoCoordinates: importRoute.geoCoordinates,
    createdTime: importRoute.createdTime || new Date().toISOString(),
    routeId: importRoute.routeId,
  });

  try {
    const response = await fetch(`${API_ROUTES_URL}/upload-route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(route),
    });

    if (!response.ok) {
      throw new Error("Failed to upload route.");
    }

    const data = await response.json();

    if (data) {
      return data;
    }

    throw new Error("No route returned from the server.");
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to upload route.");
  }
}
