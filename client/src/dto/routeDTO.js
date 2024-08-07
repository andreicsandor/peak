export class Route {
  constructor({
    id = null,
    name = "",
    waypoints = "",
    geoCoordinates = "",
    distance = 0,
    duration = 0,
    elevationGain = 0,
    weatherMetrics = null,
    location = "",
    createdTime = null,
    importedRouteId = null,
    percentageSimilarity = null,
    completedTime = null,
  } = {}) {
    this.id = id;
    this.name = name;
    this.waypoints = waypoints;
    this.geoCoordinates = geoCoordinates;
    this.weatherMetrics = weatherMetrics;
    this.distance = distance;
    this.duration = duration;
    this.elevationGain = elevationGain;
    this.location = location;
    this.createdTime = createdTime;
    this.importedRouteId = importedRouteId;
    this.percentageSimilarity = percentageSimilarity;
    this.completedTime = completedTime;
  }
}
