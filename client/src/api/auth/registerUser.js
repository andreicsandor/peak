import { API_REGISTER_URL } from "../../config/apiConfig";

export async function registerUser(registerData) {
  try {
    const response = await fetch(`${API_REGISTER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}
