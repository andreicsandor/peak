export async function fetchWeather(lat, lon, datetime) {
  const weatherURL = `http://localhost:8083/api/weather/get-forecast?lat=${lat}&lon=${lon}&datetime=${datetime}`;
  try {
    const response = await fetch(weatherURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
}
