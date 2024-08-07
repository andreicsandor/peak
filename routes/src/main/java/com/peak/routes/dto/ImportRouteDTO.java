package com.peak.routes.dto;

import java.time.LocalDateTime;

public class ImportRouteDTO extends BaseRouteDTO {
    private Long routeId;

    public ImportRouteDTO() {
    }

    public ImportRouteDTO(Long id, String name, String waypoints, String geoCoordinates, LocalDateTime createdTime, Long routeId) {
        super(id, name, waypoints, geoCoordinates, createdTime);
        this.routeId = routeId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }
}
