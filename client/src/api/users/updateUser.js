import { API_USERS_URL } from "../../config/apiConfig"; 
import { getAuthHeader } from "../../utils/profileUtils";

export async function updateUser(profileData) {
  try {
    const response = await fetch(`${API_USERS_URL}/update-person`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
