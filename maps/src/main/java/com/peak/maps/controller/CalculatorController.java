package com.peak.maps.controller;

import com.peak.maps.service.CalculatorService;
import com.peak.routes.dto.ImportRouteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {

    private final CalculatorService calculatorService;

    @Autowired
    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/compare-routes")
    public ResponseEntity<?> compareRoutes(@RequestParam Long routeId, @RequestBody ImportRouteDTO importRouteDTO) {
        try {
            double similarityPercentage = calculatorService.calculateSimilarityPercentage(routeId, importRouteDTO);
            return ResponseEntity.ok(Map.of("similarityPercentage", similarityPercentage));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
