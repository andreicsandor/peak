package com.peak.routes.dto;

import java.time.LocalDateTime;

public abstract class BaseRouteDTO {
    private Long id;
    private String name;
    private String waypoints;
    private String geoCoordinates;
    private LocalDateTime createdTime;

    public BaseRouteDTO() {
    }

    public BaseRouteDTO(Long id, String name, String waypoints, String geoCoordinates, LocalDateTime createdTime) {
        this.id = id;
        this.name = name;
        this.waypoints = waypoints;
        this.geoCoordinates = geoCoordinates;
        this.createdTime = createdTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(String waypoints) {
        this.waypoints = waypoints;
    }

    public String getGeoCoordinates() {
        return geoCoordinates;
    }

    public void setGeoCoordinates(String geoCoordinates) {
        this.geoCoordinates = geoCoordinates;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}
