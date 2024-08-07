export class RouteMetrics {
  constructor({ distance = 0, elevationGain = 0, duration = 0 } = {}) {
    this.distance = distance;
    this.elevationGain = elevationGain;
    this.duration = duration;
  }
}
