import {
  addMapLoader,
  addProfileLoader,
  addRoutesLoader,
  removeProfileLoader,
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
import { addRouteCards } from "./src/utils/interfaceUtils.js";
import { resetRoutePanel } from "./src/components/createRoutePanel.js";
import { addLocationSearchBar } from "./src/components/createSearchControls.js";
import { addLocationButton } from "./src/components/createSearchControls.js";
import { addWeatherWidget } from "./src/components/createWeatherControls.js";
import { getCookie, getPersonIdFromCookie } from "./src/utils/authUtils.js";
import { checkOwnership } from "./src/api/checkOwnership.js";
import {
  setupOptionButtonEvents
} from "./src/components/createProfilePanel.js";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleProfileFetch,
  handleProfileUpdate,
  handleProfileDelete,
} from "./src/utils/authUtils.js"
import { formatDatePicker } from "./src/utils/interfaceUtils.js";
import { addDefaultBodyMetrics } from "./src/components/createProfilePanel.js";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

// HTML templates
function getRegisterPageTemplate() {
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
        <h1 style="margin-bottom: 2rem">Join Peak</h1>
        <form id="registerForm">
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
            <label class="label-custom" for="password">Password</label>
            <input type="password" id="password" class="input-custom input-wide" placeholder="Enter password" required>
          </div>
          <div class="input-group">
            <label class="label-custom" for="birthdate">Birthdate</label>
            <input 
            type="text" 
            id="birthdate" 
            class="input-custom input-wide" 
            placeholder="Select birthdate" 
            value="${defaultBirthdateString}" 
            required
            onfocus="(this.type='date')" 
            onblur="(this.type='text')" 
            onclick="this.type='date'"
            onkeydown="return false;"
          >
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
              <label class="label-custom" for="weight">Weight kg.</label>
              <input type="number" id="weight" class="input-custom input-half" placeholder="Enter weight" required>
            </div>
            <div class="input-group-half">
              <label class="label-custom" for="height">Height cm.</label>
              <input type="number" id="height" class="input-custom input-half" placeholder="Enter height" required>
            </div>
          </div>
          <div class="input-group">
            <label class="label-custom" for="workouts">Weekly Workouts</label>
            <div class="option-buttons" required>
              <button type="button" class="option-button" data-frequency="0">Never</button>
              <button type="button" class="option-button" data-frequency="1">Once</button>
              <button type="button" class="option-button" data-frequency="2">Twice</button>
              <button type="button" class="option-button" data-frequency="3">Thrice</button>
              <button type="button" class="option-button" data-frequency="4">More</button>
            </div>
            <div class="athleticism-output"><span id="athleticism-level">Not Athletic</span></div>
          </div>
          <button type="submit" class="control-button" id="register-button">Join</button>
        </form>
        <button class="control-button" id="redirect-button">I have an account</button>
      </div>
    </div>
  `;
}

function getLoginPageTemplate() {
  return `
    <div class="profile-section">
      <div class="profile-wrapper">
        <h1 style="margin-bottom: 2rem">Log In to Peak</h1>
        <form id="loginForm">
          <div class="input-group">
            <label class="label-custom" for="username">Username</label>
            <input type="text" id="username" class="input-custom input-wide" placeholder="Enter username" required>
          </div>
          <div class="input-group">
            <label class="label-custom" for="password">Password</label>
            <input type="password" id="password" class="input-custom input-wide" placeholder="Enter password" required>
          </div>
          <button type="submit" class="control-button" id="login-button">Log In</button>
        </form>
        <button class="control-button" id="redirect-button">I don't have an account</button>
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
      <div class="profile-loader-wrapper hidden">
        <div class="profile-loader">
          <i class="fa-solid fa-user fa-fade fa-2xl" style="color: #c9c9d9;"></i>
        </div>
      </div>
      <div class="profile-wrapper hidden">
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
            <label class="label-custom" for="password">Password</label>
            <input type="password" id="password" class="input-custom input-wide" placeholder="Enter password" required>
        </div>
        <div class="input-group">
          <label class="label-custom" for="birthdate">Birthdate</label>
          <input 
          type="text" 
          id="birthdate" 
          class="input-custom input-wide" 
          placeholder="Select birthdate" 
          value="${defaultBirthdateString}" 
          required
          onfocus="(this.type='date')" 
          onblur="(this.type='text')" 
          onclick="this.type='date'"
          onkeydown="return false;"
        >
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
            <label class="label-custom" for="weight">Weight kg.</label>
            <input type="number" id="weight" class="input-custom input-half" placeholder="Enter weight" required>
          </div>
          <div class="input-group-half">
            <label class="label-custom" for="height">Height cm.</label>
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
        <button class="control-button" id="update-profile-button">Save Changes</button>
        <button class="delete-button" id="delete-profile-button">Delete Profile</button>
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

function setupRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
}

function setupRegisterRedirect() {
  const registerButton = document.getElementById("redirect-button");

  registerButton.addEventListener("click", (event) => {
    event.preventDefault();
    navigateTo("/join");
  });
}

function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

function setupLoginRedirect() {
  const loginButton = document.getElementById("redirect-button");

  loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    navigateTo("/");
  });
}

function setupLogoutForm() {
  handleLogout();
}

// Render content logic
function renderRegisterPage() {
  const loggedInUser = getCookie("userToken");

  if (loggedInUser) {
    window.location.href = "/run";
    return;
  }

  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getRegisterPageTemplate();

  setupOptionButtonEvents();
  formatDatePicker();
  addDefaultBodyMetrics();
  setupRegisterForm();
  setupLoginRedirect();
}

function renderLoginPage() {
  const loggedInUser = getCookie("userToken");

  if (loggedInUser) {
    window.location.href = "/run";
    return;
  }

  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getLoginPageTemplate();

  setupLoginForm();
  setupRegisterRedirect();
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

  addProfileLoader();
  setupOptionButtonEvents();
  handleProfileFetch();

  const updateProfileButton = document.getElementById("update-profile-button");
  if (updateProfileButton) {
    updateProfileButton.addEventListener("click", handleProfileUpdate);
  }

  const deleteProfileButton = document.getElementById("delete-profile-button");
  if (deleteProfileButton) {
    deleteProfileButton.addEventListener("click", handleProfileDelete);
  }

  formatDatePicker();
  setTimeout(() => {
    removeProfileLoader();
  }, 500);
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = "";

  if (url === "/") {
    renderLoginPage();
  } else if (url === "/join") {
    renderRegisterPage();
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

// Conditionally displaying the logout button
function displayLogoutButton() {
  const logoutContainer = document.getElementById("logout-container");

  const personId = getPersonIdFromCookie();

  if (personId) {
    logoutContainer.innerHTML = `
      <a href="/logout" aria-label="Log out" class="text-white font-bold">
        <img class="logo" src="./src/assets/x.svg" alt="app logo" />
      </a>
    `;
  } else {
    logoutContainer.innerHTML = "";
  }
}

// Call this function on page load
document.addEventListener("DOMContentLoaded", () => {
  displayLogoutButton();
});

// Resizing & orientation scripts
function handleOrientationChange() {
  const menuWrapper = document.querySelector(".dashboard-menu-wrapper");
  const mapWrapper = document.querySelector(".map-wrapper");
  const mapMessage = document.querySelector(".map-message");

  if (menuWrapper && mapMessage && mapMessage) {
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
}

window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);
document.addEventListener("DOMContentLoaded", handleOrientationChange);
