package com.peak.assistant.service.impl;

import com.peak.assistant.dto.AssistantRequestDTO;
import com.peak.assistant.dto.AssistantResponseDTO;
import com.peak.assistant.service.AssistantService;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.model.WeatherMetrics;
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

        String prompt = generatePrompt(request.getRouteData());
        String responseText = callChatGPT(prompt);

        AssistantResponseDTO response = new AssistantResponseDTO();
        response.setRecommendation(responseText);
        return response;
    }

    private String generatePrompt(RouteDTO routeData) {
        WeatherMetrics weatherMetrics = routeData.getWeatherMetrics();

        StringBuilder prompt = new StringBuilder();
        prompt.append("Route Data:\n")
                .append("ID: ").append(routeData.getId()).append("\n")
                .append("Name: ").append(routeData.getName()).append("\n")
                .append("Waypoints: ").append(routeData.getWaypoints()).append("\n")
                .append("GeoCoordinates: ").append(routeData.getGeoCoordinates()).append("\n")
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

        prompt.append("Based on the above data, provide an app-suitable recommendation (circa 5 phrases) for the planned running route. ")
                .append("Include specific tips on hydration, food intake, types of running shoes based on short/long distance and timing of eating before the run. ")
                .append("If weather data is available, describe how the conditions might feel, including the impact of humidity or wind, and explain why these factors are important for preparation. ")
                .append("If weather data is not available, mention that weather factors could also influence preparation. ")
                .append("Tailor recommendations based on the route data and avoid general tips. Avoid mentioning route specific metrics like duration and distance, but focus on pace and weather data. ")
                .append("Consider the target pace, computed as duration over distance, and the overall run intensity, taking into account duration, pace, elevation gain, and weather factors. ")
                .append("Be mindful of short distances and low elevation gains. Fatigue factors may be less significant due to the short distance and small elevation gain, but still consider pace and weather conditions.")
                .append("Keep in mind that distance and elevation gain are measured in meters, while duration is in seconds. ")
                .append("Additionally, provide a fatigue factor recommendation based on the route data, run intensity, and weather conditions.")
                .append("Keep the recommendation within a couple of lines. ");

        return prompt.toString();
    }

    private String callChatGPT(String prompt) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", new JSONArray().put(new JSONObject().put("role", "system").put("content", "You are a helpful assistant."))
                .put(new JSONObject().put("role", "user").put("content", prompt)));
        requestBody.put("max_tokens", 150);
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
        JSONObject responseBody = new JSONObject(response.getBody());

        return responseBody.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content").trim();
    }
}

