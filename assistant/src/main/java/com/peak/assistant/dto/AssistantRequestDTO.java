package com.peak.assistant.dto;

import com.peak.routes.dto.RouteDTO;
import com.peak.users.dto.BodyMetricsDTO;

public class AssistantRequestDTO {
    private RouteDTO routeData;
    private BodyMetricsDTO bodyMetricsData;

    public RouteDTO getRouteData() {
        return routeData;
    }

    public void setRouteData(RouteDTO routeData) {
        this.routeData = routeData;
    }

    public BodyMetricsDTO getBodyMetricsData() {
        return bodyMetricsData;
    }

    public void setBodyMetricsData(BodyMetricsDTO bodyMetricsData) {
        this.bodyMetricsData = bodyMetricsData;
    }
}
