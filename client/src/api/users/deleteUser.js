import { API_USERS_URL } from "../../config/apiConfig";
import { getAuthHeader } from "../../utils/userUtils";

export async function deleteUser(personId) {
  try {
    const response = await fetch(`${API_USERS_URL}/delete-person/${personId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete profile");
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
    toastr.error("Oops, something went wrong.", "Error!");
  }
}
