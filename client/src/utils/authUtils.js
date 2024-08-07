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
