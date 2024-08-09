export class ImportRoute {
  constructor({
    id = null,
    name = "",
    waypoints = "",
    geoCoordinates = "",
    createdTime = null,
    routeId = null,
    personId = null,
  } = {}) {
    this.id = id;
    this.name = name;
    this.waypoints = waypoints;
    this.geoCoordinates = geoCoordinates;
    this.createdTime = createdTime;
    this.routeId = routeId;
    this.personId = personId;
  }
}
