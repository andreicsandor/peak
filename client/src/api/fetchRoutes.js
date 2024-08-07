import { API_ROUTES_URL } from "../config";
import { ImportRoute } from "../dto/importRouteDTO";
import { Route } from "../dto/routeDTO";
import { getAuthHeader } from "../utils/authUtils";

export async function fetchRoute(id) {
  const response = await fetch(
    `${API_ROUTES_URL}/get-routes?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    }
  );
  const data = await response.json();

  if (data && data.length > 0) {
    const route = data[0];
    return new Route({
      id: route.id,
      name: route.name,
      waypoints: route.waypoints,
      geoCoordinates: route.geoCoordinates,
      distance: route.distance,
      duration: route.duration,
      elevationGain: route.elevationGain,
      weatherMetrics: route.weatherMetrics,
      location: route.location,
      createdTime: route.createdTime,
      importedRouteId: route.importedRouteId,
      percentageSimilarity: route.percentageSimilarity,
      completedTime: route.completedTime,
    });
  }

  return null;
}

export async function fetchRoutes(routeId = null, name = null) {
  let url = `${API_ROUTES_URL}/get-routes`;

  const params = new URLSearchParams();
  if (routeId) {
    params.append("id", routeId);
  }
  if (name && name !== "") {
    params.append("name", name);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    const routes = data.map(route => new Route({
      id: route.id,
      name: route.name,
      waypoints: route.waypoints,
      geoCoordinates: route.geoCoordinates,
      distance: route.distance,
      duration: route.duration,
      elevationGain: route.elevationGain,
      weatherMetrics: route.weatherMetrics,
      location: route.location,
      createdTime: route.createdTime,
      importedRouteId: route.importedRouteId,
      percentageSimilarity: route.percentageSimilarity,
      completedTime: route.completedTime,
    }));

    return routes;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}

export async function fetchImportRoutes(id) {
  const response = await fetch(
    `${API_ROUTES_URL}/get-import-routes?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();

  if (data && data.length > 0) {
    const route = data[0];
    return new ImportRoute({
      id: route.id,
      name: route.name,
      waypoints: route.waypoints,
      geoCoordinates: route.geoCoordinates,
      distance: route.distance,
      duration: route.duration,
      elevationGain: route.elevationGain,
      createdTime: route.createdTime,
      routeId: route.routeId,
    });
  }

  return null;
}
