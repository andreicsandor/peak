import { API_MAPS_URL } from "../config/apiConfig";
import { getAuthHeader } from "../utils/profileUtils";

export async function fetchLocation(query) {
  const locationURL = `${API_MAPS_URL}/search-location?location=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(locationURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching location:", error);
    throw new Error("Failed to fetch location");
  }
}
