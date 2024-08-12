import { API_MAPS_URL } from "../../config/apiConfig";
import { getAuthHeader } from "../../utils/profileUtils";

export async function fetchDirections(coordinates, radiuses) {
  let directionURL = `${API_MAPS_URL}/get-directions?coordinates=${coordinates}`;
  if (radiuses) {
    directionURL += `&radiuses=${radiuses}`;
  }

  try {
    const response = await fetch(directionURL, {
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
    console.error("Error fetching directions:", error);
    throw new Error("Failed to fetch directions");
  }
}
