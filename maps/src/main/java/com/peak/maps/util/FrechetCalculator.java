package com.peak.maps.util;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;

public class FrechetCalculator {
    public static double calculateFrechetDistance(LineString route1, LineString route2) {
        Coordinate[] coords1 = route1.getCoordinates();
        Coordinate[] coords2 = route2.getCoordinates();

        if (coords1.length == 0 || coords2.length == 0) return Double.MAX_VALUE;

        double[][] dp = new double[coords1.length][coords2.length];
        for (int i = 0; i < coords1.length; i++) {
            for (int j = 0; j < coords2.length; j++) {
                dp[i][j] = -1;
            }
        }
        return calculate(coords1, coords2, coords1.length - 1, coords2.length - 1, dp);
    }

    private static double calculate(Coordinate[] coords1, Coordinate[] coords2, int i, int j, double[][] dp) {
        if (dp[i][j] > -1) return dp[i][j];
        if (i == 0 && j == 0) {
            dp[i][j] = distance(coords1[i], coords2[j]);
        } else {
            double minPrev = Double.MAX_VALUE;
            if (i > 0) minPrev = Math.min(minPrev, calculate(coords1, coords2, i - 1, j, dp));
            if (j > 0) minPrev = Math.min(minPrev, calculate(coords1, coords2, i, j - 1, dp));
            if (i > 0 && j > 0) minPrev = Math.min(minPrev, calculate(coords1, coords2, i - 1, j - 1, dp));
            dp[i][j] = Math.max(minPrev, distance(coords1[i], coords2[j]));
        }
        return dp[i][j];
    }

    private static double distance(Coordinate a, Coordinate b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
}
