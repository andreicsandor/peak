import { fetchWeather } from "../api/weather/fetchWeather.js";
import { globalManager } from "../managers/globalManager.js";
import { getCurrentDateTime } from "./datetimeUtils.js";
import { toCamelCase } from "./interfaceUtils.js";

const { weatherManager } = globalManager.getManagers(); 

export function getStoredWeatherForecast() {
  return weatherManager.getWeatherForecastData();
}

export function storeWeatherMetrics(forecast) {
  weatherManager.setWeatherMetricsData(forecast);
}

export async function fetchForecastData() {
  const { weatherManager } = globalManager.getManagers();
  const { lat, lon, datetime } = getCurrentDateTime();
  
  try {
    const weatherData = await fetchWeather(lat, lon, datetime);
    weatherManager.setWeatherForecastData(weatherData);

    return weatherData;
  } catch (error) {
    console.error("Failed to fetch current weather:", error);
    return null;
  }
}

export function getClosestForecast(weatherData) {
  const { datetime } = getCurrentDateTime();
  const requestedDate = new Date(datetime);

  const closestForecast = weatherData.list.reduce((prev, curr) => {
    return Math.abs(new Date(curr.dt * 1000) - requestedDate) <
      Math.abs(new Date(prev.dt * 1000) - requestedDate)
      ? curr
      : prev;
  });

  return closestForecast;
}

export function formatForecast(forecast) {
  const weatherDescription = toCamelCase(forecast.weather[0].description);
  const tempCelsius = (forecast.main.temp - 273.15).toFixed(1);
  const dateTime = new Date(forecast.dt * 1000);
  const weatherLocation = getStoredWeatherForecast().city.name;
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDateTime = dateTime.toLocaleString("en-US", options);

  return {
    description: weatherDescription,
    temperature: tempCelsius,
    dateTime: formattedDateTime,
    location: weatherLocation,
  };
}

export function calculateWeatherGrade(
  temp,
  feelsLike,
  humidity,
  pressure,
  windSpeed,
  clouds
) {
  let grade = 10;

  // Temperature (ideal range: 15°C to 25°C)
  if (temp < 15 || temp > 25) {
    grade -= Math.min(Math.abs(temp - 20) / 5, 2);
  }

  // Feels Like Temperature (same range)
  if (feelsLike < 15 || feelsLike > 25) {
    grade -= Math.min(Math.abs(feelsLike - 20) / 5, 2);
  }

  // Humidity (ideal range: 30% to 60%)
  if (humidity < 30 || humidity > 60) {
    grade -= Math.min(Math.abs(humidity - 45) / 15, 2);
  }

  // Pressure (ideal: around 1013 hPa)
  if (pressure < 1000 || pressure > 1030) {
    grade -= Math.min(Math.abs(pressure - 1013) / 10, 1);
  }

  // Wind Speed (ideal: 0 to 5 m/s)
  if (windSpeed > 5) {
    grade -= Math.min(windSpeed / 2, 2);
  }

  // Cloudiness (ideal: 0% to 50%)
  if (clouds > 50) {
    grade -= Math.min(clouds / 50, 2);
  }

  return Math.max(Math.min(Math.round(grade), 10), 1);
}

export function getWeatherDescription(grade) {
  if (grade === 10) {
    return "Excellent";
  } else if (grade >= 8) {
    return "Very Good";
  } else if (grade >= 6) {
    return "Good";
  } else if (grade >= 4) {
    return "Fair";
  } else if (grade >= 2) {
    return "Poor";
  } else {
    return "Very Poor";
  }
}
