import { API_MAPS_URL } from "../config/apiConfig";
import { getAuthHeader } from "../utils/authUtils";

export async function fetchKeys() {
  const mapUrl = `${API_MAPS_URL}/get-map`;
  const metricsUrl = `${API_MAPS_URL}/get-map-metrics`;

  try {
    const [mapResponse, metricsResponse] = await Promise.all([
      fetch(mapUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }),
      fetch(metricsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }),
    ]);

    const mapData = await mapResponse.json();
    const metricsData = await metricsResponse.json();

    return {
      mapApiKey: mapData.apiKey,
      metricsApiKey: metricsData.apiKey,
    };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    throw new Error("Failed to fetch API keys");
  }
}
