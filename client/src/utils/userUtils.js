import toastr from "toastr";
import { formatDatePicker } from "./interfaceUtils";
import { addAthleticismLabel } from "../components/createProfilePanel";
import { registerUser } from "../api/auth/registerUser";
import { loginUser } from "../api/auth/loginUser";
import { fetchUser } from "../api/users/fetchUser";
import { updateUser } from "../api/users/updateUser";
import { Person } from "../dto/personDTO";
import { BodyMetrics } from "../dto/bodyMetricsDTO";
import { calculateAge } from "./mathUtils";

export async function handleRegister(event) {
  event.preventDefault();

  const usernameElement = document.getElementById("username");
  const passwordElement = document.getElementById("password");
  const firstNameElement = document.getElementById("firstName");
  const lastNameElement = document.getElementById("lastName");
  const birthdateElement = document.getElementById("birthdate");
  const genderElement = document.getElementById("gender");
  const weightElement = document.getElementById("weight");
  const heightElement = document.getElementById("height");
  const workoutButton = document.querySelector(".option-button.active");

  const username = usernameElement.value;
  const password = passwordElement.value;
  const firstName = firstNameElement.value;
  const lastName = lastNameElement.value;

  const birthdateRaw = birthdateElement.value;
  const birthdate = new Date(birthdateRaw).toISOString().split("T")[0];

  const gender = genderElement.value;
  const weight = parseInt(weightElement.value);
  const height = parseInt(heightElement.value);
  const weeklyWorkouts = parseInt(workoutButton.getAttribute("data-frequency"));

  if (
    !username ||
    !password ||
    !firstName ||
    !lastName ||
    !birthdate ||
    !gender ||
    !weight ||
    !height ||
    !weeklyWorkouts
  ) {
    toastr.info("Please fill in all registration fields.");
    return;
  }

  const person = new Person({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    birthdate: birthdate,
    gender: gender,
    weight: weight,
    height: height,
    weeklyWorkouts: weeklyWorkouts,
  });

  try {
    const data = await registerUser(person);

    if (data && data.jwtToken) {
      toastr.success("You will be redirected shortly.", "Joined!");
      localStorage.setItem("jwtToken", data.jwtToken);

      setTimeout(() => {
        window.location.href = "/run";
      }, 3000);
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginData = { username, password };

  try {
    const data = await loginUser(loginData);

    if (data && data.jwtToken) {
      localStorage.setItem("jwtToken", data.jwtToken);
      window.location.href = "/run";
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    if (error.message === "Invalid credentials") {
      toastr.info(
        "Invalid username or password, try again.",
        "Wrong credentials"
      );
    } else {
      toastr.error("Oops, something went wrong.", "Error!");
    }
  }
}

export function handleLogout() {
  localStorage.removeItem("jwtToken");

  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  window.location.href = "/";
}

export async function handleProfileFetch() {
  const personId = getPersonIdFromCookie();

  if (!personId) {
    window.location.href = "/";
    return;
  }

  try {
    const profile = await fetchUser(personId);

    if (profile) {
      document.getElementById("firstName").value = profile.firstName || "";
      document.getElementById("lastName").value = profile.lastName || "";
      document.getElementById("username").value = profile.username || "";
      document.getElementById("password").value = "";
      document.getElementById("birthdate").value = profile.birthdate || "";
      document.getElementById("gender").value = profile.gender || "male";
      document.getElementById("weight").value = profile.weight || "";
      document.getElementById("height").value = profile.height || "";

      const optionButtons = document.querySelectorAll(".option-button");
      optionButtons.forEach((btn) => btn.classList.remove("active"));

      const workoutButton = document.querySelector(
        `.option-button[data-frequency="${profile.weeklyWorkouts}"]`
      );
      if (workoutButton) {
        workoutButton.classList.add("active");
      }

      addAthleticismLabel(profile.weeklyWorkouts);
      formatDatePicker();
    }
  } catch (error) {
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export async function handleProfileUpdate(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const birthdate = new Date(document.getElementById("birthdate").value)
    .toISOString()
    .split("T")[0];
  const gender = document.getElementById("gender").value;
  const weight = parseInt(document.getElementById("weight").value);
  const height = parseInt(document.getElementById("height").value);
  const weeklyWorkouts = parseInt(
    document
      .querySelector(".option-button.active")
      .getAttribute("data-frequency")
  );

  const personId = getPersonIdFromCookie();

  if (
    !username ||
    !password ||
    !firstName ||
    !lastName ||
    !birthdate ||
    !gender ||
    !weight ||
    !height ||
    !weeklyWorkouts
  ) {
    toastr.info("Please fill in all profile fields.");
    return;
  }

  if (!personId) {
    return;
  }

  try {
    await updateUser(
      personId,
      username,
      password,
      firstName,
      lastName,
      birthdate,
      gender,
      weight,
      height,
      weeklyWorkouts
    );
    toastr.success("Profile updated successfully.");
  } catch (error) {
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

export async function handleProfileDelete(event) {
  event.preventDefault();

  const confirmed = confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );
  if (!confirmed) return;

  const personId = getPersonIdFromCookie();

  if (!personId) {
    return;
  }

  try {
    await deleteProfile(personId);
    toastr.success("You will be redirected shortly.", "Deleted!");
    localStorage.removeItem("jwtToken");
    document.cookie =
      "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    toastr.error("Oops, something went wrong.", "Error!");
  }
}

// Extra authentication-related utils
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function getPersonIdFromCookie() {
  const userToken = getCookie("userToken");

  if (!userToken) {
    return null;
  }

  const decodedToken = atob(userToken);

  const tokenParts = decodedToken.split(":");
  const personId = tokenParts[0];

  return personId;
}

export function getUsernameFromCookie() {
  const userToken = getCookie("userToken");

  if (!userToken) {
    return null;
  }

  const decodedToken = atob(userToken);

  const tokenParts = decodedToken.split(":");
  const username = tokenParts[2];

  return username;
}

export function getAuthHeader() {
  const token = localStorage.getItem("jwtToken");
  return { Authorization: `${token}` };
}

export async function getBodyMetrics() {
  const userId = getPersonIdFromCookie();
  const person = await fetchUser(userId);

  if (person) {
    const age = calculateAge(person.birthdate);

    return new BodyMetrics({
      age: age,
      weight: person.weight,
      height: person.height,
      weeklyWorkouts: person.weeklyWorkouts,
    });
  }

  return null;
}
