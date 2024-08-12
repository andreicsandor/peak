import { API_LOGIN_URL } from "../../config/apiConfig";

export async function loginUser(loginData) {
  try {
    const response = await fetch(`${API_LOGIN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });

    if (response.status === 401) {
      throw new Error("Invalid credentials");
    }

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
