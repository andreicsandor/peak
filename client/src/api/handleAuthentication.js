import { API_LOGIN_URL } from "../config/apiConfig";

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
      console.log(response);
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
