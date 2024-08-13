package com.peak.assistant.service.impl;

import com.peak.assistant.dto.AssistantRequestDTO;
import com.peak.assistant.dto.AssistantResponseDTO;
import com.peak.assistant.service.AssistantService;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.model.WeatherMetrics;
import com.peak.users.dto.BodyMetricsDTO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AssistantServiceImpl implements AssistantService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public AssistantResponseDTO getRecommendation(AssistantRequestDTO request) {
        RouteDTO routeData = request.getRouteData();
        BodyMetricsDTO userData = request.getBodyMetricsData();

        String prompt = generatePrompt(routeData, userData);
        String responseText = callChatGPT(prompt);

        AssistantResponseDTO response = new AssistantResponseDTO();
        response.setRecommendation(responseText);
        return response;
    }

    private String generatePrompt(RouteDTO routeData, BodyMetricsDTO userData) {
        WeatherMetrics weatherMetrics = routeData.getWeatherMetrics();

        StringBuilder prompt = new StringBuilder();
        prompt.append("Route Data:\n")
                .append("Distance: ").append(routeData.getDistance()).append(" meters\n")
                .append("Elevation Gain: ").append(routeData.getElevationGain()).append(" meters\n")
                .append("Duration: ").append(routeData.getDuration()).append(" seconds\n")
                .append("Location: ").append(routeData.getLocation()).append("\n\n");

        if (weatherMetrics.getScheduledTime() != null) {
            prompt.append("Weather Data:\n")
                    .append("Temperature: ").append(weatherMetrics.getTemperature()).append(" °C\n")
                    .append("Feels Like: ").append(weatherMetrics.getFeelsLike()).append(" °C\n")
                    .append("Humidity: ").append(weatherMetrics.getHumidity()).append(" %\n")
                    .append("Pressure: ").append(weatherMetrics.getPressure()).append(" hPa\n")
                    .append("Wind Speed: ").append(weatherMetrics.getWindSpeed()).append(" m/s\n")
                    .append("Clouds: ").append(weatherMetrics.getClouds()).append(" %\n")
                    .append("Description: ").append(weatherMetrics.getDescription()).append("\n\n");
        } else {
            prompt.append("Weather Data: Not Available\n\n");
        }

        if (userData != null) {
            prompt.append("User Body Metrics:\n")
                    .append("Age: ").append(userData.getAge()).append("\n")
                    .append("Weight: ").append(userData.getWeight()).append(" kg\n")
                    .append("Height: ").append(userData.getHeight()).append(" cm\n")
                    .append("Weekly Workouts: ").append(userData.getWeeklyWorkouts()).append("\n\n");
        }

        prompt.append("Based on the above data, provide an app-suitable recommendation of circa 4 phrases for the planned running route. ")
                .append("Tailor recommendations based on the user data, route data and avoid general tips. ")
                .append("Consider the target pace, computed as duration over distance, and the overall run intensity, taking into account duration, pace and elevation gain. ")
                .append("Take into account the age, weight, height and how active the person is. ")
                .append("If weather data is available, describe how the conditions might feel, including the impact of humidity or wind. ")
                .append("If weather data is unavailable, skip weather related tips by all means. ")
                .append("Give pre-workout food & hydration recommendations based on required level of energy for the effort. ")
                .append("Keep in mind that distance and elevation gain are measured in meters, duration is in seconds, height in centimeters and weight in kilograms. ")
                .append("Use one decimal for any number that is not round in the case of weather data. ")
                .append("Avoid mentioning route duration and distance values in your response by all means. ")
                .append("Do not give numbered or bullet lists, instead add a small tittle before each phrase, e.g. Distance:, Nutrition:, Weather: .")
                .append("Be concise and give clear instructions.");

        return prompt.toString();
    }

    private String callChatGPT(String prompt) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4-turbo");
        requestBody.put("messages", new JSONArray().put(new JSONObject().put("role", "system").put("content", "You are a helpful assistant, a dietitian & running coach."))
                .put(new JSONObject().put("role", "user").put("content", prompt)));
        requestBody.put("max_tokens", 500);
        requestBody.put("temperature", 0.5);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
        JSONObject responseBody = new JSONObject(response.getBody());

        return responseBody.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content").trim();
    }
}

