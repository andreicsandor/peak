package com.peak.maps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/mapping")
public class MapsController {

    @Value("${mapbox.api.key}")
    private String mapboxApiKey;

    @Value("${gmaps.api.key}")
    private String gmapsApiKey;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/get-map")
    public ResponseEntity<?> getMapsApiKey() {
        return ResponseEntity.ok().body(Map.of("apiKey", mapboxApiKey));
    }

    @GetMapping("/get-map-metrics")
    public ResponseEntity<?> getMapMetricsApiKey() {
        return ResponseEntity.ok().body(Map.of("apiKey", gmapsApiKey));
    }

    @GetMapping("/get-directions")
    public ResponseEntity<?> getDirections(
            @RequestParam String coordinates,
            @RequestParam(required = false) String radiuses) {
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder
                    .fromHttpUrl("https://api.mapbox.com/directions/v5/mapbox/walking/" + coordinates)
                    .queryParam("geometries", "geojson")
                    .queryParam("access_token", mapboxApiKey)
                    .queryParam("overview", "full")
                    .queryParam("steps", "true");

            if (radiuses != null && !radiuses.isEmpty()) {
                uriBuilder.queryParam("radiuses", radiuses);
            }

            URI uri = uriBuilder.build(true).toUri();

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            return ResponseEntity.ok().body(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch directions: " + e.getMessage());
        }
    }

    @GetMapping("/get-elevation")
    public ResponseEntity<?> getElevation(@RequestParam String path, @RequestParam String samples) {
        try {
            String encodedPath = path.startsWith("enc:") ? path.substring(4) : path;
            encodedPath = URLEncoder.encode(encodedPath, StandardCharsets.UTF_8.name());

            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://maps.googleapis.com/maps/api/elevation/json")
                    .queryParam("path", "enc:" + encodedPath)
                    .queryParam("samples", samples)
                    .queryParam("key", gmapsApiKey)
                    .build(true)
                    .toUri();

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

            if (!response.getStatusCode().isError()) {
                return ResponseEntity.ok().body(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode()).body("API Error: " + response.getBody());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch elevation data: " + e.getMessage());
        }
    }

    @GetMapping("/search-location")
    public ResponseEntity<?> searchLocation(@RequestParam String location) {
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder
                    .fromHttpUrl("https://api.mapbox.com/geocoding/v5/mapbox.places/" + URLEncoder.encode(location, "UTF-8") + ".json")
                    .queryParam("access_token", mapboxApiKey);

            URI uri = uriBuilder.build(true).toUri();

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            return ResponseEntity.ok().body(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch location: " + e.getMessage());
        }
    }

    @GetMapping("/get-suggestions")
    public ResponseEntity<?> getSuggestions(@RequestParam String query) {
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder
                    .fromHttpUrl("https://api.mapbox.com/geocoding/v5/mapbox.places/" + URLEncoder.encode(query, "UTF-8") + ".json")
                    .queryParam("access_token", mapboxApiKey)
                    .queryParam("autocomplete", "true")
                    .queryParam("limit", "5");

            URI uri = uriBuilder.build(true).toUri();

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            return ResponseEntity.ok().body(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch suggestions: " + e.getMessage());
        }
    }
}
