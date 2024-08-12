import { API_LOGIN_URL, API_REGISTER_URL } from "../config/apiConfig";

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

  if (
    !usernameElement ||
    !passwordElement ||
    !firstNameElement ||
    !lastNameElement ||
    !birthdateElement ||
    !genderElement ||
    !weightElement ||
    !heightElement ||
    !workoutButton
  ) {
    console.error("Some form elements are missing or have incorrect IDs.");
    return;
  }

  const username = usernameElement.value;
  const password = passwordElement.value;
  const firstName = firstNameElement.value;
  const lastName = lastNameElement.value;

  const birthdateRaw = birthdateElement.value;
  const birthdate = new Date(birthdateRaw).toISOString().split('T')[0]; // Format as YYYY-MM-DD

  const gender = genderElement.value;
  const weight = weightElement.value;
  const height = heightElement.value;
  const weeklyWorkouts = workoutButton.getAttribute("data-frequency");

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
      console.log(data);
      if (data && data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken);
        
        setTimeout(() => {
          window.location.href = "/run";
        }, 3000); //
      } else {
        throw new Error("User data not found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const loginData = { username, password };

  fetch(`${API_LOGIN_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    if (data && data.jwtToken) {
      localStorage.setItem('jwtToken', data.jwtToken);
      window.location.href = '/run';
    } else {
        throw new Error('User data not found');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

export function handleLogout() {
  localStorage.removeItem('jwtToken');

  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  window.location.href = '/';
}
