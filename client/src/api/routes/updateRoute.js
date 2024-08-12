import { API_ROUTES_URL } from "../../config/apiConfig";
import { Route } from "../../dto/routeDTO";
import { RouteMetrics } from "../../dto/routeMetricsDTO";
import { WeatherMetrics } from "../../dto/weatherMetricsDTO";
import { getAuthHeader } from "../../utils/userUtils";

export async function updateRoute(
  id,
  waypoints,
  coordinates,
  routeMetricsData,
  weatherMetricsData,
  location,
  importedRouteId = null,
  percentageSimilarity = null,
  personId,
) {
  const waypointsWKT = `LINESTRING (${waypoints
    .map((waypoint) => `${waypoint.lng} ${waypoint.lat}`)
    .join(", ")})`;

  const coordinatesWKT = `LINESTRING (${coordinates
    .map((coordinate) => `${coordinate.lng} ${coordinate.lat}`)
    .join(", ")})`;

  const routeMetrics = routeMetricsData
    ? new RouteMetrics(routeMetricsData)
    : new RouteMetrics();

  const distance = routeMetrics.distance;
  const elevationGain = routeMetrics.elevationGain;
  const duration = routeMetrics.duration;

  const weatherMetrics = weatherMetricsData
    ? new WeatherMetrics(weatherMetricsData)
    : new WeatherMetrics();

  const routeName = weatherMetricsData?.timePeriod
    ? `${
        weatherMetricsData.timePeriod.charAt(0).toUpperCase() +
        weatherMetricsData.timePeriod.slice(1)
      } Activity`
    : null;

  const route = new Route({
    id: id,
    name: routeName,
    waypoints: waypointsWKT,
    geoCoordinates: coordinatesWKT,
    distance: distance,
    duration: duration,
    elevationGain: elevationGain,
    weatherMetrics: weatherMetrics,
    location: location,
    personId: personId,
    importedRouteId: importedRouteId,
    percentageSimilarity: percentageSimilarity,
  });

  try {
    const response = await fetch(
      `${API_ROUTES_URL}/update-route`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(route),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update route.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating the route:", error);
    throw new Error("Failed to update route");
  }
}
