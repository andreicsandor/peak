package com.peak.routes.dto;

import com.peak.routes.model.WeatherMetrics;

import java.time.LocalDateTime;

public class RouteDTO extends BaseRouteDTO {
    private double distance;
    private double duration;
    private double elevationGain;
    private String location;
    private WeatherMetrics weatherMetrics;
    private Long importedRouteId;
    private Double percentageSimilarity;
    private LocalDateTime completedTime;

    public RouteDTO() {
    }

    public RouteDTO(Long id, String name, String waypoints, String geoCoordinates, double distance, double duration, double elevationGain, String location, LocalDateTime createdTime, Long personId, WeatherMetrics weatherMetrics, Long importedRouteId, Double percentageSimilarity, LocalDateTime completedTime) {
        super(id, name, waypoints, geoCoordinates, createdTime, personId);
        this.distance = distance;
        this.duration = duration;
        this.elevationGain = elevationGain;
        this.location = location;
        this.weatherMetrics = weatherMetrics;
        this.importedRouteId = importedRouteId;
        this.percentageSimilarity = percentageSimilarity;
        this.completedTime = completedTime;
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public WeatherMetrics getWeatherMetrics() {
        return weatherMetrics;
    }

    public void setWeatherMetrics(WeatherMetrics weatherMetrics) {
        this.weatherMetrics = weatherMetrics;
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
