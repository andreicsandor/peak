package com.peak.routes.controller;

import com.peak.routes.dto.NewRouteDTO;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.dto.RoutePatchDTO;
import com.peak.routes.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/routing")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping("/routes")
    public List<RouteDTO> getRoutes(@RequestParam(value = "id", required = false) Long id,
                                    @RequestParam(value = "name", required = false) String name) {
        List<RouteDTO> routes;

        if (id != null) {
            routes = routeService.findRouteById(id);
        } else if (name != null) {
            routes = routeService.findRouteByName(name);
        } else {
            routes = routeService.findRoutes();
        }

        if (routes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No routes found");
        }

        return routes;
    }

    @PostMapping("/save-route")
    public ResponseEntity<?> saveRoute(@RequestBody NewRouteDTO newRouteDTO) {
        RouteDTO routeDTO = routeService.createRoute(newRouteDTO);
        if (routeDTO != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(routeDTO);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to save route.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update-route")
    public ResponseEntity<?> updateRoute(@RequestBody RoutePatchDTO routePatchDTO) {
        boolean result = routeService.updateRoute(routePatchDTO);
        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Route updated successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update route.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/delete-route/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        Boolean result = routeService.deleteRoute(id);

        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Route deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete route.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
