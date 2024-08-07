package com.peak.routes.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.LineString;

import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String name;

    @Column(name = "waypoints", columnDefinition = "geography")
    private LineString waypoints;

    @Column(name = "coordinates", columnDefinition = "geography")
    private LineString geoCoordinates;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

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

    public LineString getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(LineString waypoints) {
        this.waypoints = waypoints;
    }

    public LineString getGeoCoordinates() {
        return geoCoordinates;
    }

    public void setGeoCoordinates(LineString geoCoordinates) {
        this.geoCoordinates = geoCoordinates;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}
