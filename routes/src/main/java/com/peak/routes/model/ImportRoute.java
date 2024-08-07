package com.peak.routes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import org.locationtech.jts.geom.LineString;

import java.time.LocalDateTime;

@Entity
@Table(name = "import_routes")
public class ImportRoute extends BaseRoute {

    @Column(name = "route_id")
    private Long routeId;

    public ImportRoute() {}

    public ImportRoute(String name, LineString waypoints, LineString geoCoordinates, LocalDateTime createdTime, Long routeId) {
        super.setName(name);
        super.setWaypoints(waypoints);
        super.setGeoCoordinates(geoCoordinates);
        super.setCreatedTime(createdTime);
        this.routeId = routeId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }
}
