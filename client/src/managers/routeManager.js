import toastr from "toastr";
import { fetchDirections } from "../api/fetchDirections";
import { toastrOptions } from "../config/toastrConfig"; 

toastr.options = toastrOptions;

export class RouteManager {
  constructor(map, accessToken, eventBus) {
    this.map = map;
    this.accessToken = accessToken;
    this.eventBus = eventBus;
    this.geoCoordinates = [];
    this.waypoints = [];
    this.velocity = 10.91;
    this.totalDistance = 0;
    this.totalDuration = 0;
  }

  async setVelocity(newVelocity) {
    this.velocity = newVelocity;
    await this.computeRoute();
  }

  getVelocity() {
    return this.velocity;
  }

  setTotalDistance(totalDistance) {
    this.totalDistance = totalDistance;
  }

  getTotalDistance() {
    return this.totalDistance;
  }

  setTotalDuration(totalDuration) {
    this.totalDuration = totalDuration;
  }

  getTotalDuration() {
    return this.totalDuration;
  }

  async insertWaypoint(waypoint) {
    this.waypoints.push(waypoint);
    await this.computeRoute();
  }

  async insertWaypoints(waypoints) {
    this.waypoints.push(...waypoints);
    await this.computeRoute();
  }

  async insertWaypointAfter(waypointToInsert, referenceWaypoint) {
    const index = this.getIndexOfWaypoint(referenceWaypoint);
    if (index !== -1) {
      this.waypoints.splice(index + 1, 0, waypointToInsert);
    } else {
      this.waypoints.push(waypointToInsert);
    }
    await this.computeRoute();
  }

  async deleteWaypoint(waypoint) {
    const index = this.waypoints.indexOf(waypoint);
    if (index > -1) {
      this.waypoints.splice(index, 1);
      await this.computeRoute();
    }
  }

  async updateWaypoint(waypoint, newCoordinates) {
    const foundIndex = this.waypoints.findIndex((wp) => wp === waypoint);
    if (foundIndex !== -1) {
      this.waypoints[foundIndex].setLngLat(newCoordinates);
      await this.computeRoute();
      return true;
    }
    return false;
  }

  getIndexOfWaypoint(waypoint) {
    return this.waypoints.indexOf(waypoint);
  }

  getWaypointByCoordinates(coordinates) {
    for (let waypoint of this.waypoints) {
      const waypointCoordinates = waypoint.getLngLat();
      if (
        waypointCoordinates.lng === coordinates[0] &&
        waypointCoordinates.lat === coordinates[1]
      ) {
        return waypoint;
      }
    }
  }

  getWaypointBefore(waypoint) {
    const index = this.getIndexOfWaypoint(waypoint);
    if (index > 0) {
      return this.waypoints[index - 1];
    }
    return null;
  }

  getWaypoints() {
    return this.waypoints;
  }

  getGeoCoordinates() {
    return this.geoCoordinates;
  }

  async getDirections(chunk) {
    const coordString = chunk.join(";");

    try {
      const data = await fetchDirections(coordString);
      return data;
    } catch (error) {
      console.error("Error fetching directions:", error);
      throw new Error("Network request failed");
    }
  }

  computeSegments(waypoints, chunkSize = 25) {
    let chunks = [];
    for (let i = 0; i < waypoints.length; i += chunkSize) {
      chunks.push(
        waypoints.slice(i, Math.min(i + chunkSize, waypoints.length))
      );
    }
    return chunks;
  }

  async computeRoute() {
    if (this.waypoints.length < 2) {
      this.eventBus.publish("clearRoute");
      return;
    }

    const waypoints = this.waypoints.map(
      (waypoint) => `${waypoint.getLngLat().lng},${waypoint.getLngLat().lat}`
    );
    const chunks = this.computeSegments(waypoints);
    let combinedGeoCoordinates = [];
    let totalDistance = 0;

    for (const chunk of chunks) {
      try {
        const data = await this.getDirections(chunk);
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          combinedGeoCoordinates.push(...route.geometry.coordinates);
          totalDistance += route.distance;
        } else {
          console.error("No routes found for chunk", chunk);
          toastr.error("Undo & add waypoint again.", "Couldn't get directions!");
        }
      } catch (error) {
        console.log("Skipping this chunk due to an error:", error);
        toastr.error("Route is too long, undo & add a closer waypoint.", "Couldn't get directions!");
        continue;
      }
    }

    combinedGeoCoordinates = combinedGeoCoordinates.filter(
      (coord, index, self) =>
        index === 0 || !this.areCoordinatesEqual(coord, self[index - 1])
    );

    this.geoCoordinates = combinedGeoCoordinates;
    this.setTotalDistance(totalDistance);
    this.setTotalDuration((totalDistance / 1000) / this.getVelocity() * 3600);

    this.eventBus.publish("displayRoute", {
      geometry: { coordinates: this.geoCoordinates, type: "LineString" },
      distance: this.getTotalDistance(),
      duration: this.getTotalDuration(),
    });
  }

  areCoordinatesEqual(coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
  }
}
