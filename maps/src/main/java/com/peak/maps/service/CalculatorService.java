package com.peak.maps.service;

import com.peak.routes.dto.ImportRouteDTO;

public interface CalculatorService {
    double calculateSimilarityPercentage(Long routeId, ImportRouteDTO importRouteDTO);
}
