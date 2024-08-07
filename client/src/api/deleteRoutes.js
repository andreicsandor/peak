import { API_ROUTES_URL } from "../config";
import { getAuthHeader } from "../utils/authUtils";

export async function deleteRoute(id) {
  return fetch(`${API_ROUTES_URL}/delete-route/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete route");
      }
    })
    .catch((error) => {
      console.error("Error deleting the route:", error);
      throw error;
    });
}

export async function deleteImportRoute(id) {
  return fetch(`${API_ROUTES_URL}/delete-import-route/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete imported route");
      }
    })
    .catch((error) => {
      console.error("Error deleting the imported route:", error);
      throw error;
    });
}
