export class WeatherMetrics {
  constructor({
    description = null,
    temperature = null,
    feelsLike = null,
    humidity = null,
    pressure = null,
    windSpeed = null,
    clouds = null,
    scheduledTime = null,
    timePeriod = null,
  } = {}) {
    this.description = description;
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.pressure = pressure;
    this.windSpeed = windSpeed;
    this.clouds = clouds;
    this.scheduledTime = scheduledTime;
    this.timePeriod = timePeriod;
  }
}
