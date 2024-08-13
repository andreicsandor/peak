import toastr from "toastr";
import { toCamelCase } from "../utils/interfaceUtils";
import {
  activateDashboardControls,
  deactivateDashboardControls,
} from "../utils/interfaceUtils";
import {
  calculateWeatherGrade,
  getWeatherDescription,
  fetchForecastData,
  getStoredWeatherForecast,
  formatForecast,
  storeWeatherMetrics,
  getClosestForecast,
} from "../utils/weatherUtils";
import {
  ForecastFilters,
  getForecastFilter,
  setForecastFilter,
} from "../const/forecastFilters";
import { toastrOptions } from "../config/toastrConfig"; 

toastr.options = toastrOptions;

export async function addWeatherWidget(weatherMetrics = null) {
  const weatherWrapper = document.querySelector(".dashboard-weather-wrapper");

  const contentMarkup = `
    <div class="weather-container">
      <div class="weather-content">
        <div class="weather-description">-----</div>
        <div class="weather-temperature">--°C</div>
        <div class="weather-location">-----</div>
        <div class="weather-date-time">--, --:--</div>
      </div>
    </div>
  `;

  weatherWrapper.innerHTML = contentMarkup;

  try {
    if (weatherMetrics && weatherMetrics.scheduledTime) {
      const fullForecast = await fetchForecastData();
      const requestedDate = new Date(weatherMetrics.scheduledTime);
      const requestedDateUTC = new Date(
        requestedDate.getTime() - requestedDate.getTimezoneOffset() * 60000
      );
      const updatedForecastForDate = fullForecast.list.find((forecast) => {
        const forecastDateUTC = new Date(forecast.dt * 1000);
        return forecastDateUTC >= requestedDateUTC;
      });

      if (updatedForecastForDate) {
        storeWeatherMetrics(updatedForecastForDate);
        const formattedForecast = formatForecast(updatedForecastForDate);
        updateWeatherWidget(formattedForecast);
      } else {
        const closestForecast = getClosestForecast(fullForecast);
        storeWeatherMetrics(closestForecast);
        const formattedForecast = formatForecast(closestForecast);
        if (formattedForecast) {
          updateWeatherWidget(formattedForecast);
        }
      }
    } else {
      const fullForecast = await fetchForecastData();
      const closestForecast = getClosestForecast(fullForecast);
      const formattedForecast = formatForecast(closestForecast);
      if (formattedForecast) {
        updateWeatherWidget(formattedForecast);
      }
    }
  } catch (error) {
    console.error("Failed to fetch current weather:", error);
    toastr.error("Oops, something went wrong.", "Error!");
  }

  const dateTimeElement = document.querySelector(".weather-date-time");
  dateTimeElement.addEventListener("click", addWeatherOverlay);
}

function updateWeatherWidget(forecast) {
  const descriptionElement = document.querySelector(".weather-description");
  const temperatureElement = document.querySelector(".weather-temperature");
  const dateTimeElement = document.querySelector(".weather-date-time");
  const locationElement = document.querySelector(".weather-location");

  descriptionElement.textContent = forecast.description;
  temperatureElement.textContent = `${forecast.temperature}°C`;
  dateTimeElement.textContent = forecast.dateTime;
  locationElement.textContent = forecast.location;
}

function addWeatherOverlay() {
  const overlay = document.getElementById("dashboard-forecast-overlay");
  overlay.innerHTML = `
    <div class="overlay-header">
      <button href="#" class="control-button" id="close-forecast-overlay">
        <img src="./src/assets/x.svg" alt="Logo">
      </button>
      <button class="sort-button" data-filter="${ForecastFilters.EXCELLENT}">Excellent</button>
      <button class="sort-button" data-filter="${ForecastFilters.VERY_GOOD}">Very Good</button>
      <button class="sort-button" data-filter="${ForecastFilters.GOOD}">Good</button>
      <button class="sort-button" data-filter="${ForecastFilters.FAIR}">Fair</button>
      <button class="sort-button" data-filter="${ForecastFilters.POOR}">Poor</button>
      <button class="sort-button" data-filter="${ForecastFilters.VERY_POOR}">Very Poor</button>
    </div>
    <div class="overlay-content"></div>
  `;

  document.querySelectorAll(".sort-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const filter = event.target.getAttribute("data-filter");
      const currentFilter = getForecastFilter();

      if (currentFilter === filter) {
        setForecastFilter(ForecastFilters.ALL);
        event.target.classList.remove("active");
      } else {
        setForecastFilter(filter);
        document
          .querySelectorAll(".sort-button")
          .forEach((btn) => btn.classList.remove("active"));
        event.target.classList.add("active");
      }

      addForecastCards();
    });
  });

  addForecastCards();

  overlay.style.display = "block";
  deactivateDashboardControls();

  document
    .querySelector("#close-forecast-overlay")
    .addEventListener("click", () => {
      overlay.style.display = "none";
      setForecastFilter(ForecastFilters.ALL);
      activateDashboardControls();
    });
}

function addForecastCards() {
  const weatherData = getStoredWeatherForecast();

  const overlay = document.getElementById("dashboard-forecast-overlay");
  const overlayContent = document.querySelector(".overlay-content");
  overlayContent.innerHTML = "";

  const periods = [
    { title: "Morning", hours: [6, 9, 12] },
    { title: "Afternoon", hours: [12, 15, 18] },
    { title: "Evening", hours: [18, 21, 24] },
    { title: "Night", hours: [0, 3, 6] },
  ];

  const groupedForecasts = {};

  weatherData.list.forEach((forecast) => {
    const dateTime = new Date(forecast.dt * 1000);
    const hour = dateTime.getHours();
    const isToday = dateTime.toDateString() === new Date().toDateString();
    const isTomorrow = new Date().getDate() + 1 === dateTime.getDate();
    const day = isToday
      ? "Today"
      : isTomorrow
      ? "Tomorrow"
      : dateTime.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

    let periodTitle;
    if (isToday || isTomorrow) {
      for (const period of periods) {
        if (hour >= period.hours[0] && hour < period.hours[2]) {
          periodTitle = `${day} ${period.title}`;
          break;
        }
      }
    } else {
      periodTitle = day;
    }

    if (!groupedForecasts[periodTitle]) {
      groupedForecasts[periodTitle] = [];
    }

    groupedForecasts[periodTitle].push(forecast);
  });

  let hasMatchingForecasts = false;

  for (const [key, forecasts] of Object.entries(groupedForecasts)) {
    const filteredForecasts = forecasts.filter((forecast) => {
      const tempCelsius = (forecast.main.temp - 273.15).toFixed(1);
      const feelsLikeCelsius = (forecast.main.feels_like - 273.15).toFixed(1);
      const humidity = forecast.main.humidity;
      const pressure = forecast.main.pressure;
      const windSpeed = forecast.wind.speed;
      const clouds = forecast.clouds.all;

      const weatherGrade = calculateWeatherGrade(
        tempCelsius,
        feelsLikeCelsius,
        humidity,
        pressure,
        windSpeed,
        clouds
      );
      const weatherRating = getWeatherDescription(weatherGrade);

      const currentFilter = getForecastFilter();
      return (
        currentFilter === ForecastFilters.ALL ||
        currentFilter ===
          weatherRating.replace(/\s/g, "").toLowerCase() + "Cond"
      );
    });

    if (filteredForecasts.length > 0) {
      hasMatchingForecasts = true;
      const dayPeriodMarkup = `<h2 class="forecast-heading sticky-heading">${key}</h2>`;
      overlayContent.innerHTML += dayPeriodMarkup;

      filteredForecasts.forEach((forecast) => {
        const dateTime = new Date(forecast.dt * 1000);
        const options =
          key.includes("Today") || key.includes("Tomorrow")
            ? { hour: "numeric", minute: "numeric", hour12: true }
            : { hour: "numeric", minute: "numeric", hour12: true };
        const formattedDateTime = dateTime.toLocaleString("en-US", options);
        const weatherDescription = toCamelCase(forecast.weather[0].description);
        const tempCelsius = (forecast.main.temp - 273.15).toFixed(1);
        const feelsLikeCelsius = (forecast.main.feels_like - 273.15).toFixed(1);
        const humidity = forecast.main.humidity;
        const pressure = forecast.main.pressure;
        const windSpeed = forecast.wind.speed;
        const clouds = forecast.clouds.all;

        const weatherGrade = calculateWeatherGrade(
          tempCelsius,
          feelsLikeCelsius,
          humidity,
          pressure,
          windSpeed,
          clouds
        );
        const weatherRating = getWeatherDescription(weatherGrade);

        const forecastMarkup = `
          <div class="forecast-card" data-forecast='${JSON.stringify(
            forecast
          )}'>
            <div class="card-body">
              <div class="forecast-info">
                <div class="forecast-datetime">${formattedDateTime}</div>
                <div class="forecast-description">${weatherDescription}</div>
                <div class="forecast-main">
                  <div class="forecast-temperature">${tempCelsius}°C</div>
                  <div class="forecast-rating">${weatherRating}</div>
                </div>
                <div class="forecast-details">
                  <div class="forecast-detail"><span>Feels Like</span><span>${feelsLikeCelsius}°C</span></div>
                  <div class="forecast-detail"><span>Humidity</span><span>${humidity}%</span></div>
                  <div class="forecast-detail"><span>Pressure</span><span>${pressure} hPa</span></div>
                  <div class="forecast-detail"><span>Wind Speed</span><span>${windSpeed} m/s</span></div>
                  <div class="forecast-detail"><span>Clouds</span><span>${clouds}%</span></div>
                </div>
              </div>
            </div>
          </div>
        `;
        overlayContent.innerHTML += forecastMarkup;
      });
    }
  }

  document.querySelectorAll(".forecast-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const forecast = JSON.parse(
        event.currentTarget.getAttribute("data-forecast")
      );

      const formattedForecast = formatForecast(forecast);
      updateWeatherWidget(formattedForecast);
      storeWeatherMetrics(forecast);
      overlay.style.display = "none";
      setForecastFilter(ForecastFilters.ALL);
      activateDashboardControls();
      toastr.info("Route is now scheduled for a run.");
    });
  });

  if (!hasMatchingForecasts) {
    overlayContent.innerHTML = `<h2 class="main-message">No forecasted days meeting these conditions.</h2>`;
  }
}
