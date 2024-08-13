import { API_USERS_URL } from "../../config/apiConfig";
import { Person } from "../../dto/personDTO";
import { getAuthHeader } from "../../utils/userUtils";

export async function updateUser(
  id,
  username,
  password,
  firstName,
  lastName,
  birthdate,
  gender,
  weight,
  height,
  weeklyWorkouts
) {
  const formattedBirthdate = new Date(birthdate).toISOString().split("T")[0];

  const person = new Person({
    id: id,
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    birthdate: formattedBirthdate,
    gender: gender,
    weight: parseInt(weight),
    height: parseInt(height),
    weeklyWorkouts: parseInt(weeklyWorkouts),
  });

  try {
    const response = await fetch(`${API_USERS_URL}/update-person`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(person),
    });

    if (!response.ok) {
      throw new Error("Failed to update person.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating the person:", error);
    throw new Error("Failed to update person");
  }
}
