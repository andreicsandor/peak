import { getAuthHeader } from "../../utils/userUtils";
import { API_ROUTES_URL } from "../../config/apiConfig";

export async function checkOwnership(routeId, personId) {
  try {
    const payload = {
      routeId: routeId,
      personId: personId,
    };

    const response = await fetch(`${API_ROUTES_URL}/check-ownership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to verify route ownership.");
    }

    const data = await response.json();

    return data.isOwnedByUser;
  } catch (error) {
    throw new Error("Failed to verify route ownership.");
  }
}
