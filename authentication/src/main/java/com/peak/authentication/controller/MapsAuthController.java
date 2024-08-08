package com.peak.authentication.controller;

import com.peak.routes.dto.ImportRouteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/auth/maps")
public class MapsAuthController {

    @Autowired
    @Qualifier("restTemplateAuth")
    private final RestTemplate restTemplate;

    public MapsAuthController(@Qualifier("restTemplateAuth") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/get-map")
    public ResponseEntity<?> getMapsApiKey() {
        return restTemplate.exchange("http://localhost:8082/api/mapping/get-map", HttpMethod.GET, null, Map.class);
    }

    @GetMapping("/get-map-metrics")
    public ResponseEntity<?> getMapMetricsApiKey() {
        return restTemplate.exchange("http://localhost:8082/api/mapping/get-map-metrics", HttpMethod.GET, null, Map.class);
    }

    @GetMapping("/get-directions")
    public ResponseEntity<?> getDirections(@RequestParam String coordinates, @RequestParam(required = false) String radiuses) {
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:8082/api/mapping/get-directions")
                    .queryParam("coordinates", URLEncoder.encode(coordinates, StandardCharsets.UTF_8.name()));

            if (radiuses != null && !radiuses.isEmpty()) {
                uriBuilder.queryParam("radiuses", URLEncoder.encode(radiuses, StandardCharsets.UTF_8.name()));
            }

            URI uri = uriBuilder.build(true).toUri();
            return restTemplate.exchange(uri, HttpMethod.GET, null, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch directions: " + e.getMessage());
        }
    }

    @GetMapping("/get-elevation")
    public ResponseEntity<?> getElevation(@RequestParam String path, @RequestParam String samples) {
        try {
            String encodedPath = path.startsWith("enc:") ? path.substring(4) : path;
            encodedPath = URLEncoder.encode(encodedPath, StandardCharsets.UTF_8.name());

            URI uri = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:8082/api/mapping/get-elevation")
                    .queryParam("path", "enc:" + encodedPath)
                    .queryParam("samples", samples)
                    .build(true)
                    .toUri();

            return restTemplate.exchange(uri, HttpMethod.GET, null, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch elevation data: " + e.getMessage());
        }
    }

    @GetMapping("/search-location")
    public ResponseEntity<?> searchLocation(@RequestParam String location) {
        try {
            URI uri = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:8082/api/mapping/search-location")
                    .queryParam("location", URLEncoder.encode(location, StandardCharsets.UTF_8.name()))
                    .build(true)
                    .toUri();

            return restTemplate.exchange(uri, HttpMethod.GET, null, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch location: " + e.getMessage());
        }
    }

    @GetMapping("/get-suggestions")
    public ResponseEntity<?> getSuggestions(@RequestParam String query) {
        try {
            URI uri = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:8082/api/mapping/get-suggestions")
                    .queryParam("query", URLEncoder.encode(query, StandardCharsets.UTF_8.name()))
                    .build(true)
                    .toUri();

            return restTemplate.exchange(uri, HttpMethod.GET, null, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch suggestions: " + e.getMessage());
        }
    }

    @PostMapping("/compare-routes")
    public ResponseEntity<?> compareRoutes(@RequestParam Long routeId, @RequestBody ImportRouteDTO importRouteDTO) {
        HttpEntity<ImportRouteDTO> request = new HttpEntity<>(importRouteDTO);
        String url = "http://localhost:8082/api/calculator/compare-routes?routeId=" + routeId;
        return restTemplate.exchange(url, HttpMethod.POST, request, Map.class);
    }
}
