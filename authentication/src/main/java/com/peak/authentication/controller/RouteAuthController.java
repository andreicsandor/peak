package com.peak.authentication.controller;

import com.peak.routes.dto.ImportRouteDTO;
import com.peak.routes.dto.NewRouteDTO;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.dto.RoutePatchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*")
@RequestMapping("/auth/routes")
@RestController
public class RouteAuthController {

    @Autowired
    @Qualifier("restTemplateAuth")
    private final RestTemplate restTemplate;

    public RouteAuthController(@Qualifier("restTemplateAuth") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/get-routes")
    @ResponseBody
    public List<RouteDTO> getRoutes(@RequestParam(value = "id", required = false) Long id, @RequestParam(value = "name", required = false) String name) {
        RouteDTO[] routes = restTemplate.exchange("http://localhost:8081/api/routing/routes" + (id != null ? "?id=" + id : (name != null ? "?name=" + name : "")), HttpMethod.GET, null, RouteDTO[].class).getBody();
        return List.of(routes);
    }

    @PostMapping("/save-route")
    public ResponseEntity<?> createRoute(@RequestBody NewRouteDTO newRouteDTO) {
        HttpEntity<NewRouteDTO> request = new HttpEntity<>(newRouteDTO);
        return restTemplate.exchange("http://localhost:8081/api/routing/save-route", HttpMethod.POST, request, RouteDTO.class);
    }

    @PutMapping("/update-route")
    public ResponseEntity<?> updateRoute(@RequestBody RoutePatchDTO routePatchDTO) {
        HttpEntity<RoutePatchDTO> request = new HttpEntity<>(routePatchDTO);
        System.out.println(routePatchDTO.getDistance());
        return restTemplate.exchange("http://localhost:8081/api/routing/update-route", HttpMethod.PUT, request, String.class);
    }

    @DeleteMapping("/delete-route/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        return restTemplate.exchange("http://localhost:8081/api/routing/delete-route/{id}", HttpMethod.DELETE, null, String.class, id);
    }

    @GetMapping("/get-import-routes")
    @ResponseBody
    public List<ImportRouteDTO> getImportRoutes(@RequestParam(value = "id", required = false) Long id) {
        ImportRouteDTO[] routes = restTemplate.exchange("http://localhost:8081/api/importing/routes" + (id != null ? "?id=" + id : ""), HttpMethod.GET, null, ImportRouteDTO[].class).getBody();
        return List.of(routes);
    }

    @PostMapping("/upload-route")
    public ResponseEntity<?> uploadRoute(@RequestBody ImportRouteDTO importRouteDTO) {
        HttpEntity<ImportRouteDTO> request = new HttpEntity<>(importRouteDTO);
        return restTemplate.exchange("http://localhost:8081/api/importing/upload-route", HttpMethod.POST, request, ImportRouteDTO.class);
    }

    @DeleteMapping("/delete-import-route/{id}")
    public ResponseEntity<?> deleteImportRoute(@PathVariable Long id) {
        return restTemplate.exchange("http://localhost:8081/api/importing/delete-route/{id}", HttpMethod.DELETE, null, String.class, id);
    }
}


