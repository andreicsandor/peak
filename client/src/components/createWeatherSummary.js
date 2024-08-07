import { toCamelCase } from "../utils/interfaceUtils";
import { calculateWeatherGrade, getWeatherDescription } from "../utils/weatherUtils";

export function createWeatherSummary(weatherLocation, weatherMetrics) {
  const date = new Date(weatherMetrics.scheduledTime);
  const dateUTC = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  const formattedDateTime = new Date(dateUTC).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const weatherDescription = toCamelCase(weatherMetrics.description);
  const tempCelsius = weatherMetrics.temperature.toFixed(1);
  const feelsLikeCelsius = weatherMetrics.feelsLike.toFixed(1);
  const humidity = weatherMetrics.humidity;
  const pressure = weatherMetrics.pressure;
  const windSpeed = weatherMetrics.windSpeed;
  const clouds = weatherMetrics.clouds;
  const location = weatherLocation;

  const weatherGrade = calculateWeatherGrade(tempCelsius, feelsLikeCelsius, humidity, pressure, windSpeed, clouds);
  const weatherRating = getWeatherDescription(weatherGrade);

  const weatherSummaryMarkup = `
    <div class="weather-summary">
      <div class="summary-card">
        <div class="card-body">
          <div class="summary-info">
            <div class="summary-location">Route Scheduled</div>
            <div class="summary-datetime">${formattedDateTime}</div>
            <div class="summary-location">${location}</div>
            <div class="summary-description">${weatherDescription}</div>
            <div class="summary-main">
              <div class="summary-temperature">${tempCelsius}°C</div>
              <div class="summary-rating">${weatherRating}</div>
            </div>
            <div class="summary-details">
              <div class="summary-detail"><span>Feels Like</span><span>${feelsLikeCelsius}°C</span></div>
              <div class="summary-detail"><span>Humidity</span><span>${humidity}%</span></div>
              <div class="summary-detail"><span>Pressure</span><span>${pressure} hPa</span></div>
              <div class="summary-detail"><span>Wind Speed</span><span>${windSpeed} m/s</span></div>
              <div class="summary-detail"><span>Clouds</span><span>${clouds}%</span></div>
            </div>
            <div class="summary-message">Click Edit to view up-to-date forecast</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const weatherSummary = document.createElement('div');
  weatherSummary.innerHTML = weatherSummaryMarkup;
  return weatherSummary;
}
