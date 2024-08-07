package com.peak.weather.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Value("${openweather.api.key}")
    private String openWeatherMapApiKey;

    private final RestTemplate restTemplate;

    public WeatherController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/get-weather")
    public ResponseEntity<?> getWeather(
            @RequestParam String lat,
            @RequestParam String lon,
            @RequestParam String datetime) {
        try {
            long timestamp = convertToTimestamp(datetime);

            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://api.openweathermap.org/data/2.5/weather")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("dt", timestamp)
                    .queryParam("appid", openWeatherMapApiKey)
                    .build(true)
                    .toUri();

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            return ResponseEntity.ok().body(response.getBody());
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid datetime format: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch weather data: " + e.getMessage());
        }
    }

    @GetMapping("/get-forecast")
    public ResponseEntity<?> getForecast(
            @RequestParam String lat,
            @RequestParam String lon,
            @RequestParam String datetime) {
        try {
            long timestamp = convertToTimestamp(datetime);

            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://api.openweathermap.org/data/2.5/forecast")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", openWeatherMapApiKey)
                    .build(true)
                    .toUri();

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            return ResponseEntity.ok().body(response.getBody());
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid datetime format: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch weather data: " + e.getMessage());
        }
    }

    private long convertToTimestamp(String datetime) {
        ZonedDateTime zdt = ZonedDateTime.parse(datetime);
        return zdt.toEpochSecond();
    }
}
