package com.peak.routes.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
public class Route extends BaseRoute {

    @Column(name = "distance")
    private double distance;

    @Column(name = "duration")
    private double duration;

    @Column(name = "elevation_gain")
    private double elevationGain;

    @Embedded
    private WeatherMetrics weatherMetrics;

    @Column(length = 255)
    private String location;

    @Column(name = "imported_route_id")
    private Long importedRouteId;

    @Column(name = "percentage_similarity")
    private Double percentageSimilarity;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public double getElevationGain() {
        return elevationGain;
    }

    public void setElevationGain(double elevationGain) {
        this.elevationGain = elevationGain;
    }

    public WeatherMetrics getWeatherMetrics() {
        return weatherMetrics;
    }

    public void setWeatherMetrics(WeatherMetrics weatherMetrics) {
        this.weatherMetrics = weatherMetrics;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getImportedRouteId() {
        return importedRouteId;
    }

    public void setImportedRouteId(Long importedRouteId) {
        this.importedRouteId = importedRouteId;
    }

    public Double getPercentageSimilarity() {
        return percentageSimilarity;
    }

    public void setPercentageSimilarity(Double percentageSimilarity) {
        this.percentageSimilarity = percentageSimilarity;
    }

    public LocalDateTime getCompletedTime() {
        return completedTime;
    }

    public void setCompletedTime(LocalDateTime completedTime) {
        this.completedTime = completedTime;
    }
}
