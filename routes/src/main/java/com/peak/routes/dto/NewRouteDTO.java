package com.peak.routes.dto;

import com.peak.routes.model.WeatherMetrics;

import java.time.LocalDateTime;

public class NewRouteDTO extends BaseRouteDTO {
    private double distance;
    private double duration;
    private double elevationGain;
    private String location;
    private WeatherMetrics weatherMetrics;
    private Long importedRouteId;
    private Double percentageSimilarity;

    public NewRouteDTO() {
    }

    public NewRouteDTO(String name, String waypoints, String geoCoordinates, double distance, double duration, double elevationGain, String location, LocalDateTime createdTime, WeatherMetrics weatherMetrics, Long importedRouteId, Double percentageSimilarity) {
        super(null, name, waypoints, geoCoordinates, createdTime);
        this.distance = distance;
        this.duration = duration;
        this.elevationGain = elevationGain;
        this.location = location;
        this.weatherMetrics = weatherMetrics;
        this.importedRouteId = importedRouteId;
        this.percentageSimilarity = percentageSimilarity;
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
}
