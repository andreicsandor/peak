import { API_MAPS_URL } from "../../config/apiConfig";
import { getAuthHeader } from "../../utils/userUtils";

export async function fetchSuggestions(query) {
  const url = `${API_MAPS_URL}/get-suggestions?query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url, {
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
    console.error("Error fetching suggestions:", error);
    return { features: [] };
  }
}
