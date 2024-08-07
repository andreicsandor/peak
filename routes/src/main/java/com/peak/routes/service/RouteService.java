package com.peak.routes.service;

import com.peak.routes.dto.NewRouteDTO;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.dto.RoutePatchDTO;

import java.util.List;

public interface RouteService {
    RouteDTO createRoute(NewRouteDTO newRouteDTO);
    Boolean updateRoute(RoutePatchDTO routePatchDTO);
    Boolean deleteRoute(Long id);
    List<RouteDTO> findRoutes();
    List<RouteDTO> findRouteById(Long id);
    List<RouteDTO> findRouteByName(String name);
}
