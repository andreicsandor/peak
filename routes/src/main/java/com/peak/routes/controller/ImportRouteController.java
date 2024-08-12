package com.peak.routes.controller;

import com.peak.routes.dto.ImportRouteDTO;
import com.peak.routes.service.ImportRouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/importing")
public class ImportRouteController {

    private final ImportRouteService importRouteService;

    @Autowired
    public ImportRouteController(ImportRouteService importRouteService) {
        this.importRouteService = importRouteService;
    }

    @GetMapping("/routes")
    public List<ImportRouteDTO> getImportRoutes(@RequestParam(value = "id", required = false) Long id) {
        List<ImportRouteDTO> routes;

        if (id != null) {
            routes = importRouteService.findImportRouteById(id);
        } else {
            routes = importRouteService.findImportRoutes();
        }

        if (routes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No routes found");
        }

        return routes;
    }

    @PostMapping("/import-route")
    public ResponseEntity<?> importRoute(@RequestParam("gpxFile") MultipartFile file, @RequestParam("routeId") Long routeId, @RequestParam("personId") Long personId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "No file uploaded"));
        }

        try {
            List<ImportRouteDTO> parsedImportRoutes = importRouteService.processImportRoute(file, routeId, personId);
            return ResponseEntity.ok().body(Map.of("message", "File processed successfully", "routes", parsedImportRoutes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error processing file", "error", e.getMessage()));
        }
    }

    @PostMapping("/upload-route")
    public ResponseEntity<?> uploadRoute(@RequestBody ImportRouteDTO newImportRouteDTO) {
        ImportRouteDTO importRouteDTO = importRouteService.createImportRoute(newImportRouteDTO);
        if (importRouteDTO != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(importRouteDTO);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to save route.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/delete-route/{id}")
    public ResponseEntity<?> deleteImportRoute(@PathVariable Long id) {
        Boolean result = importRouteService.deleteImportRoute(id);

        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Import route deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete import route.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/delete-routes/person/{personId}")
    public ResponseEntity<?> deleteImportRoutesByPersonId(@PathVariable Long personId) {
        Boolean result = importRouteService.deleteImportRoutesByPersonId(personId);

        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Import routes deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete import routes.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
