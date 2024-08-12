export function addMapLoader() {
  const loader = document.querySelector(".map-loader");
  loader.classList.remove("hidden");
}

export function removeMapLoader() {
  const loader = document.querySelector(".map-loader");
  loader.classList.add("hidden");
}

export function addRoutesLoader() {
  const loader = document.querySelector(".routes-loader");
  loader.classList.remove("hidden"); 
}

export function removeRoutesLoader() {
  const loader = document.querySelector(".routes-loader");
  loader.classList.add("hidden");
}

export function addPanelLoader() {
  const loader = document.querySelector(".panel-loader");
  loader.classList.remove("hidden"); 
}

export function removePanelLoader() {
  const loader = document.querySelector(".panel-loader");
  loader.classList.add("hidden");
}

export function addProfileLoader() {
  const profileWrapper = document.querySelector(".profile-wrapper");
  profileWrapper.classList.add("hidden");

  const loaderWrapper = document.querySelector(".profile-loader-wrapper");
  loaderWrapper.classList.remove("hidden"); 
}

export function removeProfileLoader() {
  const loaderWrapper = document.querySelector(".profile-loader-wrapper");
  loaderWrapper.classList.add("hidden");

  const profileWrapper = document.querySelector(".profile-wrapper");
  profileWrapper.classList.remove("hidden");
}