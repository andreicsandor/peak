package com.peak.routes.service.impl;

import com.peak.routes.dto.NewRouteDTO;
import com.peak.routes.dto.RouteDTO;
import com.peak.routes.dto.RoutePatchDTO;
import com.peak.routes.mapper.RouteMapper;
import com.peak.routes.model.Route;
import com.peak.routes.repository.RouteDAO;
import com.peak.routes.service.ImportRouteService;
import com.peak.routes.service.RouteService;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.WKTReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteDAO routeDAO;

    @Autowired
    private ImportRouteService importRouteService;

    @Autowired
    private RouteMapper routeMapper;

    private final WKTReader wktReader = new WKTReader();
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public RouteDTO createRoute(NewRouteDTO newRouteDTO) {
        Route route = new Route();
        route.setName(newRouteDTO.getName());

        try {
            if (newRouteDTO.getWaypoints() != null && !newRouteDTO.getWaypoints().isEmpty()) {
                LineString lineStringWaypoints = (LineString) wktReader.read(newRouteDTO.getWaypoints());
                lineStringWaypoints.setSRID(4326);
                route.setWaypoints(lineStringWaypoints);
            }
            if (newRouteDTO.getGeoCoordinates() != null && !newRouteDTO.getGeoCoordinates().isEmpty()) {
                LineString lineStringGeoCoordinates = (LineString) wktReader.read(newRouteDTO.getGeoCoordinates());
                lineStringGeoCoordinates.setSRID(4326);
                route.setGeoCoordinates(lineStringGeoCoordinates);
            }
        } catch (org.locationtech.jts.io.ParseException e) {
            throw new RuntimeException(e);
        }

        route.setDistance(newRouteDTO.getDistance());
        route.setDuration(newRouteDTO.getDuration());
        route.setElevationGain(newRouteDTO.getElevationGain());
        route.setWeatherMetrics(newRouteDTO.getWeatherMetrics());
        route.setLocation(newRouteDTO.getLocation());
        route.setCreatedTime(LocalDateTime.now());
        route.setPersonId(newRouteDTO.getPersonId());
        route.setImportedRouteId(newRouteDTO.getImportedRouteId());
        route.setPercentageSimilarity(newRouteDTO.getPercentageSimilarity());

        route = routeDAO.save(route);
        return routeMapper.toRouteDTO(route);
    }

    @Override
    public Boolean updateRoute(RoutePatchDTO routePatchDTO) {
        Long routeId = routePatchDTO.getId();
        String newName = routePatchDTO.getName();
        String newWaypoints = routePatchDTO.getWaypoints();
        String newGeoCoordinates = routePatchDTO.getGeoCoordinates();

        Optional<Route> routeEntity = routeDAO.findById(routeId);
        if (!routeEntity.isPresent()) {
            return false;
        }

        Route route = routeEntity.get();
        if (newName != null && !newName.isEmpty()) {
            route.setName(newName);
        }
        try {
            if (newWaypoints != null && !newWaypoints.isEmpty()) {
                LineString lineStringWaypoints = (LineString) wktReader.read(newWaypoints);
                lineStringWaypoints.setSRID(4326);
                route.setWaypoints(lineStringWaypoints);
            }
            if (newGeoCoordinates != null && !newGeoCoordinates.isEmpty()) {
                LineString lineStringGeoCoordinates = (LineString) wktReader.read(newGeoCoordinates);
                lineStringGeoCoordinates.setSRID(4326);
                route.setGeoCoordinates(lineStringGeoCoordinates);
            }
        } catch (org.locationtech.jts.io.ParseException e) {
            throw new RuntimeException("Failed to parse WKT", e);
        }

        if (routePatchDTO.getDistance() != 0) {
            route.setDistance(routePatchDTO.getDistance());
        }
        if (routePatchDTO.getDuration() != 0) {
            route.setDuration(routePatchDTO.getDuration());
        }
        if (routePatchDTO.getElevationGain() != 0) {
            route.setElevationGain(routePatchDTO.getElevationGain());
        }
        if (routePatchDTO.getWeatherMetrics() != null) {
            route.setWeatherMetrics(routePatchDTO.getWeatherMetrics());
        }
        route.setLocation(routePatchDTO.getLocation());
        route.setImportedRouteId(routePatchDTO.getImportedRouteId());
        route.setPercentageSimilarity(routePatchDTO.getPercentageSimilarity());

        if (route.getWeatherMetrics().getScheduledTime()== null
                && route.getPercentageSimilarity() != null
                && route.getImportedRouteId() != null) {
            route.setCompletedTime(LocalDateTime.now());
        }

        routeDAO.save(route);
        return true;
    }

    @Override
    public Boolean deleteRoute(Long id) {
        Optional<Route> routeEntity = routeDAO.findById(id);
        if (!routeEntity.isPresent()) {
            return false;
        }
        routeDAO.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public Boolean deleteRoutesByPersonId(Long personId) {
        List<Route> routes = routeDAO.findByPersonId(personId);

        if (routes.isEmpty()) {
            return true;
        }

        routeDAO.deleteAll(routes);

        return true;
    }

    @Override
    public List<RouteDTO> findRoutes() {
        List<Route> routes = (List<Route>) routeDAO.findAll();
        return routeMapper.toRouteDTOs(routes);
    }

    @Override
    public List<RouteDTO> findRouteById(Long id) {
        Optional<Route> routeEntity = routeDAO.findById(id);

        if (!routeEntity.isPresent()) {
            return Collections.emptyList();
        }

        Route route = routeEntity.get();
        List<RouteDTO> routeDTOs = new ArrayList<>();
        routeDTOs.add(routeMapper.toRouteDTO(route));

        return routeDTOs;
    }

    @Override
    public List<RouteDTO> findRouteByName(String name) {
        List<Route> routes = routeDAO.findByName(name);
        return routeMapper.toRouteDTOs(routes);
    }

    @Override
    public List<RouteDTO> findRoutesByPersonId(Long personId) {
        List<Route> routes = routeDAO.findByPersonId(personId);
        return routeMapper.toRouteDTOs(routes);
    }

    @Override
    public Boolean isRouteOwnedByPerson(Long routeId, Long personId) {
        Optional<Route> routeEntity = routeDAO.findById(routeId);

        if (routeEntity.isPresent()) {
            Route route = routeEntity.get();
            return route.getPersonId().equals(personId);
        }

        return false;
    }
}
