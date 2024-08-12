import polyline from "@mapbox/polyline";
import { fetchElevationForPath } from "../api/maps/fetchMetrics";

export class ElevationManager {
  static COORDINATES_LIMIT = 512;

  constructor(apiKey) {
    this.apiKey = apiKey;
    this.elevationGain = 0;
  }

  setElevationGain(elevationGain) {
    this.elevationGain = elevationGain;
  }

  getElevationGain() {
    return this.elevationGain;
  }

  encodePath(coordinates) {
    const chunks = [];
    for (let i = 0; i < coordinates.length; i += ElevationManager.COORDINATES_LIMIT) {
      const segment = coordinates.slice(i, i + ElevationManager.COORDINATES_LIMIT);
      chunks.push(segment);
    }

    const encodedChunks = chunks.map((chunk) =>
      polyline.encode(chunk.map((coord) => [coord[1], coord[0]]))
    );

    return encodedChunks;
  }

  calculateElevationGain(elevationPoints) {
    if (!elevationPoints || !elevationPoints.length) {
      console.error("No elevation data to calculate gain.");
      return 0;
    }
    let totalGain = 0;
    let previousElevation = elevationPoints[0].elevation;

    elevationPoints.forEach((result) => {
      if (result.elevation > previousElevation) {
        totalGain += result.elevation - previousElevation;
      }
      previousElevation = result.elevation;
    });

    return totalGain;
  }

  async computeRouteElevation(coordinates) {
    const encodedPolylines = this.encodePath(coordinates);
    const elevationPoints = await fetchElevationForPath(encodedPolylines);
    if (elevationPoints && elevationPoints.length) {
      const elevationGain = this.calculateElevationGain(elevationPoints);
      this.setElevationGain(elevationGain);
      return elevationGain;
    } else {
      console.error("Failed to compute elevation gain.");
      return null;
    }
  }
}
