import { API_MAPS_URL } from "../config";
import { getAuthHeader } from "../utils/authUtils";

export async function fetchElevationForPath(encodedPolylines) {
  const samples = "512";
  try {
    const promises = encodedPolylines.map((encodedPolyline) => {
      const encodedPath = encodeURIComponent(`enc:${encodedPolyline}`);
      const backendUrl = `${API_MAPS_URL}/get-elevation?path=${encodedPath}&samples=${samples}`;
      return fetch(backendUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      })
        .then((response) => response.json())
        .then((data) => data.results || []);
    });
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching elevation data from backend:", error);
    return null;
  }
}
