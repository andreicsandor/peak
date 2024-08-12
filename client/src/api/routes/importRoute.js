import { API_MAPS_URL } from "../../config/apiConfig";
import { ImportRoute } from "../../dto/importRouteDTO";
import { getAuthHeader } from "../../utils/profileUtils";

export async function importRoute(file, routeId, personId) {
  const formData = new FormData();
  formData.append("gpxFile", file);
  if (routeId !== null) {
    formData.append("routeId", routeId);
  }
  if (personId !== null) {
    formData.append("personId", personId);
  }

  try {
    const response = await fetch(
      "http://localhost:8081/api/importing/import-route",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to import GPX file. Status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.routes && data.routes.length > 0) {
      const routes = data.routes.map(
        (route) =>
          new ImportRoute({
            id: route.id,
            name: route.name,
            waypoints: route.waypoints,
            geoCoordinates: route.geoCoordinates,
            createdTime: route.createdTime,
            routeId: route.routeId,
            personId: route.personId,
          })
      );

      const similarityResponse = await fetch(
        `${API_MAPS_URL}/compare-routes?routeId=${routeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify(routes[0]),
        }
      );

      if (!similarityResponse.ok) {
        throw new Error(`Failed to calculate similarity. Status: ${similarityResponse.status}`);
      }

      const similarityData = await similarityResponse.json();
      const percentageSimilarity = similarityData.similarityPercentage;

      return { routes, percentageSimilarity };
    }

    throw new Error("No routes found in the imported file.");
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to import GPX file.");
  }
}
