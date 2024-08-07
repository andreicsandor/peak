export class WeatherManager {
  constructor() {
    this.weatherForecastData = null;
    this.weatherMetricsData = null;
  }

  setWeatherForecastData(weatherForecastData) {
    this.weatherForecastData = weatherForecastData;
  }

  getWeatherForecastData() {
    return this.weatherForecastData;
  }

  setWeatherMetricsData(forecast) {
    const localTime = new Date(forecast.dt * 1000);
    const timePeriod = this.getTimePeriod(localTime);

    this.weatherMetricsData = {
      description: forecast.weather[0].description,
      temperature: forecast.main.temp - 273.15,
      feelsLike: forecast.main.feels_like - 273.15,
      humidity: forecast.main.humidity,
      pressure: forecast.main.pressure,
      windSpeed: forecast.wind.speed,
      clouds: forecast.clouds.all,
      scheduledTime: localTime.toISOString(),
      timePeriod: timePeriod,
    };
  }

  getWeatherMetricsData() {
    return this.weatherMetricsData;
  }

  clearWeatherMetricsData() {
    this.weatherMetricsData = null;
  }

  getTimePeriod(date) {
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) {
      return "Morning";
    } else if (hours >= 12 && hours < 18) {
      return "Afternoon";
    } else if (hours >= 18 && hours < 24) {
      return "Evening";
    } else {
      return "Night";
    }
  }
}
