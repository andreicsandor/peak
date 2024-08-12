import toastr from "toastr";
import { API_LOGIN_URL, API_USERS_URL, API_REGISTER_URL } from "../config/apiConfig"; 
import { formatDatePicker } from "../utils/interfaceUtils";
import { addAthleticismLabel } from "../components/createProfilePanel";

export function handleRegister(event) {
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
  const weight = weightElement.value;
  const height = heightElement.value;
  const weeklyWorkouts = workoutButton.getAttribute("data-frequency");

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

  const registerData = {
    username,
    password,
    firstName,
    lastName,
    birthdate,
    gender,
    weight: parseInt(weight),
    height: parseInt(height),
    weeklyWorkouts: parseInt(weeklyWorkouts),
  };

  fetch(`${API_REGISTER_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.jwtToken) {
        toastr.success("You will be redirected shortly.", "Joined!");
        localStorage.setItem("jwtToken", data.jwtToken);

        setTimeout(() => {
          window.location.href = "/run";
        }, 3000);
      } else {
        throw new Error("User data not found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      toastr.error("Oops, something went wrong.", "Error!");
    });
}

export function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginData = { username, password };

  fetch(`${API_LOGIN_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      }
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken);
        window.location.href = "/run";
      } else {
        throw new Error("User data not found");
      }
    })
    .catch((error) => {
      if (error.message === "Invalid credentials") {
        toastr.info("Invalid username or password, try again.", "Wrong credentials");
      } else {
        toastr.error("Oops, something went wrong.", "Error!");
      }
      console.error("Error:", error);
    });
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
  const jwtToken = localStorage.getItem("jwtToken");
  const personId = getPersonIdFromCookie();

  if (!jwtToken || !personId) {
    window.location.href = "/";
    return;
  }

  fetch(`${API_USERS_URL}/get-persons?personId=${personId}`, {
    method: "GET",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      return response.json();
    })
    .then((data) => {
      const profile = data[0];

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
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
      toastr.error("Oops, something went wrong.", "Error!");
    });
}

export function handleProfileUpdate(event) {
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

  const profileData = {
    id: personId,
    firstName,
    lastName,
    username,
    password,
    birthdate,
    gender,
    weight,
    height,
    weeklyWorkouts,
  };

  fetch(`${API_USERS_URL}/update-person`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(profileData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    })
    .then((data) => {
      toastr.success("Profile updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      toastr.error("Oops, something went wrong.", "Error!");
    });
}

export function handleProfileDelete(event) {
  event.preventDefault();

  const confirmed = confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );
  if (!confirmed) return;

  const jwtToken = localStorage.getItem("jwtToken");
  const personId = getPersonIdFromCookie();

  if (!jwtToken || !personId) {
    return;
  }

  fetch(`${API_USERS_URL}/delete-person/${personId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      toastr.success("You will be redirected shortly.", "Deleted!");
        localStorage.removeItem("jwtToken");
        document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
    })
    .catch((error) => {
      console.error("Error deleting profile:", error);
      toastr.error("Oops, something went wrong.", "Error!");
    });
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
