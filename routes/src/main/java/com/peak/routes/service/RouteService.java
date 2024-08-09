package com.peak.routes.service;

import com.peak.routes.dto.NewRouteDTO;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.dto.RoutePatchDTO;

import java.util.List;
import java.util.Optional;

public interface RouteService {
    RouteDTO createRoute(NewRouteDTO newRouteDTO);
    Boolean updateRoute(RoutePatchDTO routePatchDTO);
    Boolean deleteRoute(Long id);
    Boolean deleteRoutesByPersonId(Long personId);
    List<RouteDTO> findRoutes();
    List<RouteDTO> findRouteById(Long id);
    List<RouteDTO> findRouteByName(String name);
    List<RouteDTO> findRoutesByPersonId(Long personId);
    Boolean isRouteOwnedByPerson(Long routeId, Long personId);
}
