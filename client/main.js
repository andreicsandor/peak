import {
  addMapLoader,
  addRoutesLoader,
  removeMapLoader,
  removeRoutesLoader,
} from "./src/components/createLoader";
import {
  addActionDropdown,
  addAssistantButton,
  addCompareButtons,
  addEntityButton,
  addStateButtons,
} from "./src/components/createMapControls";
import { addEmptyMap, addFetchedMap } from "./src/components/createMap.js";
import { addPaceSelector } from "./src/components/createPaceSelector.js";
import { fetchRoutes } from "./src/api/fetchRoutes.js";
import {
  addRouteCards,
  deactivateDashboardControls,
  deactivateMapControls,
  hideDashboard,
} from "./src/utils/interfaceUtils.js";
import { resetRoutePanel } from "./src/components/createRoutePanel.js";
import { addLocationSearchBar } from "./src/components/createSearchControls.js";
import { addLocationButton } from "./src/components/createSearchControls.js";
import { addWeatherWidget } from "./src/components/createWeatherControls.js";
import { getCookie, getPersonIdFromCookie } from "./src/utils/authUtils.js";
import { handleLogin, handleLogout } from "./src/api/handleAuthentication.js";
import { checkOwnership } from "./src/api/checkOwnership.js";
import {
  setupDatePicker,
  setupDefaultValues,
  setupDeleteProfileEvent,
  setupOptionButtonEvents,
} from "./src/components/createProfilePage.js";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

// HTML templates
function getHomePageTemplate() {
  return `
    <div id="content" class="login-section">
      <div class="edit-card" style="width: 100%; max-width: 400px;">
        <div class="card-body">
          <div class="content" style="display: flex; flex-direction: column; align-items: center;">
            <form id="loginForm" style="width: 100%;">
              <div class="input-group" style="margin-bottom:1rem;">
                <label class="label-custom" for="username">Username</label>
                <input type="text" id="username" class="input-custom input-wide" placeholder="Enter your username" required>
              </div>
              <div class="input-group" style="margin-bottom: 2rem">
                <label class="label-custom" for="password">Password</label>
                <input type="password" id="password" class="input-custom input-wide" placeholder="Enter your password" required>
              </div>
              <div style="width: 100%; display: flex; justify-content: center;">
                <button type="submit" class="control-button">Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getRunPageTemplate() {
  return `
    <div id="content">
      <div class="dashboard-section">
        <div class="dashboard-wrapper">
          <div class="dashboard-menu-wrapper hidden">
            <div class="entity-container"></div>
            <div class="button-group">
              <div class="action-container" style="margin-right: 1rem;"></div>
              <div class="state-container"></div>
            </div>
            <div class="assistant-container"></div>
          </div>
          <div class="map-message hidden">
            <p>Rotate your device to see the map</p>
          </div>
          <div class="map-loader hidden">
            <i class="fa-solid fa-map fa-fade fa-2xl" style="color: #c9c9d9;"></i>
          </div>
          <div class="map-wrapper">
            <div class="map-container">
              <div id="map"></div>
              <div class="dashboard-info-wrapper"></div>
              <div class="dashboard-search-wrapper hidden"></div>
              <div class="dashboard-weather-wrapper hidden"></div>
              <div class="dashboard-pace-wrapper hidden"></div>
              <div class="dashboard-forecast-overlay" id="dashboard-forecast-overlay"></div>
              <div class="dashboard-assistant-overlay" id="dashboard-assistant-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getEditPageTemplate() {
  return `
    <div id="content">
      <div class="dashboard-section">
        <div class="dashboard-wrapper">
          <div class="dashboard-menu-wrapper hidden">
            <div class="entity-container"></div>
            <div class="button-group">
              <div class="action-container" style="margin-right: 1rem;"></div>
              <div class="state-container"></div>
            </div>
            <div class="assistant-container"></div>
          </div>
          <div class="map-message hidden">
            <p>Rotate your device to see the map.</p>
          </div>
          <div class="map-loader hidden">
            <i class="fa-solid fa-map fa-fade fa-2xl" style="color: #c9c9d9;"></i>
          </div>
          <div class="map-wrapper">
            <div class="map-container">
              <div id="map"></div>
              <div class="dashboard-info-wrapper"></div>
              <div class="dashboard-search-wrapper hidden"></div>
              <div class="dashboard-weather-wrapper hidden"></div>
              <div class="dashboard-pace-wrapper hidden"></div>
              <div class="dashboard-similarity-wrapper hidden"></div>
              <div class="dashboard-forecast-overlay" id="dashboard-forecast-overlay"></div>
              <div class="dashboard-assistant-overlay" id="dashboard-assistant-overlay"></div>
            </div>
          </div>
          <div class="dashboard-compare-wrapper hidden">
            <div class="compare-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getActivityPageTemplate() {
  return `
    <div id="content">
      <div class="activity-section">
        <div class="routes-section">
          <div class="routes-sort hidden"></div>
          <div class="routes-loader hidden">
            <i class="fa-solid fa-person-running fa-fade fa-2xl" style="color: #c9c9d9;"></i>
          </div>
          <div class="routes hidden"></div>
        </div>
        <div class="panel-section"></div>
      </div>
    </div>
  `;
}

function getProfilePageTemplate() {
  const defaultBirthdate = new Date();
  defaultBirthdate.setFullYear(defaultBirthdate.getFullYear() - 18);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const defaultBirthdateString = defaultBirthdate.toLocaleDateString(
    "en-US",
    options
  );

  return `
    <div class="profile-section">
      <div class="profile-wrapper">
        <p class="profile-title">My Profile</p>
        <div class="input-group">
          <label class="label-custom" for="firstName">First Name</label>
          <input type="text" id="firstName" class="input-custom input-wide" placeholder="Enter first name" required>
        </div>
        <div class="input-group">
          <label class="label-custom" for="lastName">Last Name</label>
          <input type="text" id="lastName" class="input-custom input-wide" placeholder="Enter last name" required>
        </div>
        <div class="input-group">
          <label class="label-custom" for="username">Username</label>
          <input type="text" id="username" class="input-custom input-wide" placeholder="Enter username" required>
        </div>
        <div class="input-group">
          <label class="label-custom" for="birthdate">Birthdate</label>
          <input type="text" id="birthdate" class="input-custom input-wide" placeholder="Select birthdate" value="${defaultBirthdateString}" required>
        </div>
         <div class="input-group">
          <label class="label-custom" for="gender">Gender</label>
          <select id="gender" class="gender-dropdown" required>
            <option value="male" selected>Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="input-group-horizontal">
          <div class="input-group-half">
            <label class="label-custom" for="weight">Weight in kg.</label>
            <input type="number" id="weight" class="input-custom input-half" placeholder="Enter weight" required>
          </div>
          <div class="input-group-half">
            <label class="label-custom" for="height">Height in cm.</label>
            <input type="number" id="height" class="input-custom input-half" placeholder="Enter height" required>
          </div>
        </div>
        <div class="input-group">
          <label class="label-custom" for="workouts">Weekly Workouts</label>
          <div class="option-buttons" required>
            <button class="option-button" data-frequency="0">Never</button>
            <button class="option-button" data-frequency="1">Once</button>
            <button class="option-button" data-frequency="2">Twice</button>
            <button class="option-button" data-frequency="3">Thrice</button>
            <button class="option-button" data-frequency="4">More</button>
          </div>
          <div class="athleticism-output"><span id="athleticism-level">Not Athletic</span></div>
        </div>
        <button class="control-button" id="delete-profile">Save Changes</button>
        <button class="delete-button" id="delete-profile">Delete Profile</button>
      </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navList = document.getElementById("nav-links");
  const loggedInUser = getCookie("userToken");

  if (loggedInUser) {
    const runLink = document.createElement("li");
    runLink.innerHTML = `<a href="/run" class="text-white hover:text-black text-lg font-bold link-item">Run</a>`;
    navList.appendChild(runLink);

    const activityLink = document.createElement("li");
    activityLink.innerHTML = `<a href="/activity" class="text-white hover:text-black text-lg font-bold link-item">Activity</a>`;
    navList.appendChild(activityLink);

    const profileLink = document.createElement("li");
    profileLink.innerHTML = `<a href="/profile" class="text-white hover:text-black text-lg font-bold link-item">Me</a>`;
    navList.appendChild(profileLink);
  }

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      navigateTo(href);
    });
  });
}

function setupPopstateEvent() {
  window.addEventListener("popstate", () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

function setupLogoutForm() {
  handleLogout();
}

// Render content logic
function renderHomePage() {
  const loggedInUser = getCookie("userToken");

  if (loggedInUser) {
    window.location.href = "/run";
    return;
  }

  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getHomePageTemplate();

  setupLoginForm();
}

function renderExitPage() {
  setupLogoutForm();
}

function renderRunPage() {
  const loggedIn = getCookie("userToken");

  if (!loggedIn) {
    window.location.href = "/";
    return;
  }

  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getRunPageTemplate();

  addEntityButton("create");
  addAssistantButton();
  addActionDropdown();
  addStateButtons();
  addPaceSelector();
  addLocationSearchBar();
  addLocationButton();
  addWeatherWidget();
  handleOrientationChange();
  addMapLoader();
  addEmptyMap();
}

function renderActivityPage() {
  const loggedIn = getCookie("userToken");

  if (!loggedIn) {
    window.location.href = "/";
    return;
  }

  const personId = getPersonIdFromCookie();

  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getActivityPageTemplate();

  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.className = "overlay";
  mainContentDiv.appendChild(overlay);

  resetRoutePanel();
  addRoutesLoader();

  fetchRoutes(null, null, personId)
    .then((routes) => {
      routes.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
      addRouteCards(routes);
    })
    .finally(() => {
      setTimeout(() => {
        removeRoutesLoader();
        const listContainer = document.querySelector(".routes");
        listContainer.classList.remove("hidden");
      }, 500);
    });
}

export async function renderEditPage() {
  const loggedIn = getCookie("userToken");

  if (!loggedIn) {
    window.location.href = "/";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const routeId = urlParams.get("id");

  if (!routeId) {
    window.location.href = "/";
    return;
  }

  const personId = getPersonIdFromCookie(loggedIn);

  try {
    const isOwnedByUser = await checkOwnership(routeId, personId);

    if (!isOwnedByUser) {
      window.location.href = "/";
      return;
    }

    const mainContentDiv = document.querySelector(".main-content-component");
    mainContentDiv.innerHTML = getEditPageTemplate();

    addEntityButton("update");
    addAssistantButton();
    addActionDropdown();
    addStateButtons();
    addCompareButtons();
    addPaceSelector();
    addLocationSearchBar();
    addLocationButton();
    handleOrientationChange();
    addMapLoader();
    addFetchedMap(routeId);

  } catch (error) {
    console.error("Error during route editing:", error);
    toastr.error("Oops, something went wrong.", "Error!");
    window.location.href = "/";
  }
}

export async function renderProfilePage() {
  const loggedIn = getCookie("userToken");

  if (!loggedIn) {
    window.location.href = "/";
    return;
  }

  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getProfilePageTemplate();

  setupOptionButtonEvents();
  setupDeleteProfileEvent();
  setupDatePicker();
  setupDefaultValues();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = "";

  if (url === "/") {
    renderHomePage();
  } else if (url === "/activity") {
    renderActivityPage();
  } else if (url === "/run") {
    renderRunPage();
  } else if (url === "/edit") {
    renderEditPage();
  } else if (url === "/profile") {
    renderProfilePage();
  } else if (url === "/logout") {
    renderExitPage();
  }
}

// Call the setup functions
setupNavigationEvents();
setupPopstateEvent();
setupInitialPage();

// Resizing & orientation scripts
function handleOrientationChange() {
  removeMapLoader();

  const menuWrapper = document.querySelector(".dashboard-menu-wrapper");
  const mapWrapper = document.querySelector(".map-wrapper");
  const mapMessage = document.querySelector(".map-message");

  if (window.innerWidth > 768) {
    menuWrapper.style.display = "flex";
    mapWrapper.style.display = "block";
    mapMessage.classList.add("hidden");
  } else if (window.innerHeight > window.innerWidth) {
    menuWrapper.style.display = "none";
    mapWrapper.style.display = "none";
    mapMessage.classList.remove("hidden");
  } else {
    menuWrapper.style.display = "flex";
    mapWrapper.style.display = "block";
    mapMessage.classList.add("hidden");
  }
}

window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);
document.addEventListener("DOMContentLoaded", handleOrientationChange);
