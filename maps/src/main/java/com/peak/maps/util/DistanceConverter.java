package com.peak.maps.util;

public class DistanceConverter {

    private final double baselineDistance;

    public DistanceConverter(double baseline) {
        this.baselineDistance = baseline;
    }

    public double convertToPercentage(double frechetDistance, double routeLength) {
        double adjustedBaseline = this.baselineDistance * (routeLength + 10 * Math.log(1 + routeLength));

        if (frechetDistance > adjustedBaseline) {
            return 0;
        }
        return (1 - (frechetDistance / adjustedBaseline)) * 100;
    }
}
