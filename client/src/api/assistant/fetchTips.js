import { API_ASSISTANT_URL } from "../../config/apiConfig";
import { getAuthHeader } from "../../utils/userUtils";

export async function fetchTips(routeData) {
  const requestPayload = { routeData };

  try {
    const response = await fetch(`${API_ASSISTANT_URL}/get-tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendation. Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get recommendation:", error);
    throw new Error("Failed to get recommendation.");
  }
}
