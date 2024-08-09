package com.peak.routes.mapper;

import com.peak.routes.dto.RouteDTO;
import com.peak.routes.model.Route;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.io.WKTWriter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RouteMapper {

    private final WKTWriter wktWriter = new WKTWriter();
    private final WKTReader wktReader = new WKTReader(new GeometryFactory());

    public RouteDTO toRouteDTO(Route route) {
        RouteDTO routeDTO = new RouteDTO();
        routeDTO.setId(route.getId());
        routeDTO.setName(route.getName());
        if (route.getWaypoints() != null) {
            routeDTO.setWaypoints(wktWriter.write(route.getWaypoints()));
        }
        if (route.getGeoCoordinates() != null) {
            routeDTO.setGeoCoordinates(wktWriter.write(route.getGeoCoordinates()));
        }
        routeDTO.setDistance(route.getDistance());
        routeDTO.setDuration(route.getDuration());
        routeDTO.setElevationGain(route.getElevationGain());
        if (route.getWeatherMetrics() != null) {
            routeDTO.setWeatherMetrics(route.getWeatherMetrics());
        }
        routeDTO.setLocation(route.getLocation());
        routeDTO.setCreatedTime(route.getCreatedTime());
        routeDTO.setPersonId(route.getPersonId());
        routeDTO.setImportedRouteId(route.getImportedRouteId());
        routeDTO.setPercentageSimilarity(route.getPercentageSimilarity());
        routeDTO.setCompletedTime(route.getCompletedTime());

        return routeDTO;
    }

    public List<RouteDTO> toRouteDTOs(List<Route> routes) {
        List<RouteDTO> routeDTOs = new ArrayList<>();
        for (Route route : routes) {
            routeDTOs.add(toRouteDTO(route));
        }
        return routeDTOs;
    }

    public Route toRouteObject(RouteDTO routeDTO) {
        Route route = new Route();
        route.setId(routeDTO.getId());
        route.setName(routeDTO.getName());
        if (routeDTO.getWaypoints() != null && !routeDTO.getWaypoints().isEmpty()) {
            try {
                route.setWaypoints((LineString) wktReader.read(routeDTO.getWaypoints()));
            } catch (ParseException e) {
                throw new RuntimeException("Error parsing waypoints WKT", e);
            }
        }
        if (routeDTO.getGeoCoordinates() != null && !routeDTO.getGeoCoordinates().isEmpty()) {
            try {
                route.setGeoCoordinates((LineString) wktReader.read(routeDTO.getGeoCoordinates()));
            } catch (ParseException e) {
                throw new RuntimeException("Error parsing geoCoordinates WKT", e);
            }
        }
        route.setDistance(routeDTO.getDistance());
        route.setDuration(routeDTO.getDuration());
        route.setElevationGain(routeDTO.getElevationGain());
        route.setWeatherMetrics(routeDTO.getWeatherMetrics());
        route.setLocation(routeDTO.getLocation());
        route.setCreatedTime(routeDTO.getCreatedTime());
        route.setPersonId(routeDTO.getPersonId());
        route.setImportedRouteId(routeDTO.getImportedRouteId());
        route.setPercentageSimilarity(routeDTO.getPercentageSimilarity());
        route.setCompletedTime(routeDTO.getCompletedTime());

        return route;
    }
}
