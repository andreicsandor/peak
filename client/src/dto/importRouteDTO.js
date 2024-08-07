export class ImportRoute {
  constructor({
    id = null,
    name = "",
    waypoints = "",
    geoCoordinates = "",
    createdTime = null,
    routeId = null,
  } = {}) {
    this.id = id;
    this.name = name;
    this.waypoints = waypoints;
    this.geoCoordinates = geoCoordinates;
    this.createdTime = createdTime;
    this.routeId = routeId;
  }
}
