package com.peak.assistant.dto;

import com.peak.routes.dto.RouteDTO;

public class AssistantRequestDTO {
    private RouteDTO routeData;

    public RouteDTO getRouteData() {
        return routeData;
    }

    public void setRouteData(RouteDTO routeData) {
        this.routeData = routeData;
    }
}
