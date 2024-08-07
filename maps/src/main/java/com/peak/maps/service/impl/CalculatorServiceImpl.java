package com.peak.maps.service.impl;

import com.peak.maps.service.CalculatorService;
import com.peak.maps.util.DistanceConverter;
import com.peak.maps.util.FrechetCalculator;
import com.peak.routes.dto.ImportRouteDTO;
import com.peak.routes.mapper.ImportRouteMapper;
import com.peak.routes.model.ImportRoute;
import com.peak.routes.model.Route;
import com.peak.routes.repository.RouteDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CalculatorServiceImpl implements CalculatorService {

    @Autowired
    private RouteDAO routeDAO;

    @Autowired
    private ImportRouteMapper importRouteMapper;

    private final DistanceConverter distanceConverter = new DistanceConverter(0.025);

    @Override
    public double calculateSimilarityPercentage(Long routeId, ImportRouteDTO importRouteDTO) {
        Optional<Route> route = routeDAO.findById(routeId);

        if (route.isEmpty() || importRouteDTO == null) {
            throw new IllegalArgumentException("Route ID is invalid or import route data is missing.");
        }

        ImportRoute importRoute = importRouteMapper.toImportRouteObject(importRouteDTO);

        double frechetDistance = FrechetCalculator.calculateFrechetDistance(
                route.get().getGeoCoordinates(),
                importRoute.getGeoCoordinates());

        double averageRouteLength = (route.get().getGeoCoordinates().getLength() + importRoute.getGeoCoordinates().getLength()) / 2;

        return distanceConverter.convertToPercentage(frechetDistance, averageRouteLength);
    }
}
