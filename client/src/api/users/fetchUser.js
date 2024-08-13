import { API_USERS_URL } from "../../config/apiConfig";
import { Person } from "../../dto/personDTO";
import { getAuthHeader } from "../../utils/userUtils";

export async function fetchUser(id) {
  const response = await fetch(`${API_USERS_URL}/get-persons?personId=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  const data = await response.json();

  if (data && data.length > 0) {
    const person = data[0];
    return new Person({
      id: person.id,
      username: person.username,
      password: person.password,
      firstName: person.firstName,
      lastName: person.lastName,
      birthdate: person.birthdate,
      gender: person.gender,
      weight: person.weight,
      height: person.height,
      weeklyWorkouts: person.weeklyWorkouts,
    });
  }

  return null;
}
