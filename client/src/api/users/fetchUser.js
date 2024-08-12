import { API_USERS_URL } from "../../config/apiConfig";
import { getAuthHeader } from "../../utils/userUtils";

export async function fetchUser(personId) {
  try {
    const response = await fetch(
      `${API_USERS_URL}/get-persons?personId=${personId}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
}
