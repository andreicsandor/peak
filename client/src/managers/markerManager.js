import { Modes, getCurrentMode } from "../const/currentModes.js";
import { fetchDirections } from "../api/maps/fetchDirections.js";

export class MarkerManager {
  static NORMAL_COLOR = "#FF5733";
  static UPLOADED_COLOR = "#007CBF";
  static DUPLICATED_COLOR = "red";

  constructor(map, accessToken, eventBus) {
    this.map = map;
    this.accessToken = accessToken;
    this.eventBus = eventBus;
  }

  createMarker(pointCoordinates, color = MarkerManager.NORMAL_COLOR) {
    const marker = new mapboxgl.Marker({
      color: color,
      draggable: true,
    }).setLngLat([pointCoordinates.lng, pointCoordinates.lat]);

    marker.userData = {
      previousCoordinates: { ...pointCoordinates },
      backupCoordinates: { ...pointCoordinates },
    };

    return marker;
  }

  placeMarker(marker) {
    marker.addTo(this.map);

    marker.on("click", () => {
      const currentMode = getCurrentMode();
      if (currentMode === Modes.DELETE_WAYPOINT) {
        console.log("Attempting to delete marker");
        this.removeMarker(marker);
      }
    });

    marker.on("dragend", () => {
      const currentMode = getCurrentMode();
      if (currentMode === Modes.ADD_WAYPOINT) {
        this.snapMarker(marker, "dropped", (isValid) => {
          if (!isValid) {
            console.log(
              "Failed to re-snap marker, reverting to backup position."
            );
          }
        });
      } else {
        marker.setLngLat(marker.userData.backupCoordinates);
      }
    });

    this.eventBus.publish("refreshRoute");

    return marker;
  }

  removeMarker(marker) {
    marker.remove();
    this.eventBus.publish("refreshRoute");
  }

  async snapMarker(marker, interactionType) {
    const coordinates = marker.getLngLat();
    const radius = interactionType === "dropped" ? 50 : 5;
    const coordString = `${coordinates.lng},${coordinates.lat}`;

    try {
      const data = await fetchDirections(
        `${coordString};${coordString}`,
        `${radius};${radius}`
      );
      if (data.routes && data.routes.length > 0) {
        const nearestPoint = data.routes[0].geometry.coordinates[0];
        marker.setLngLat([nearestPoint[0], nearestPoint[1]]);
        marker.userData.previousCoordinates = {
          lng: marker.userData.backupCoordinates.lng,
          lat: marker.userData.backupCoordinates.lat,
        };
        marker.userData.backupCoordinates = {
          lng: nearestPoint[0],
          lat: nearestPoint[1],
        };
        if (interactionType === "dropped") {
          this.paintMarker(marker);
          this.eventBus.publish("movedMarker", marker);
          this.eventBus.publish("refreshRoute");
        }
        return true;
      } else {
        marker.setLngLat([
          marker.userData.backupCoordinates.lng,
          marker.userData.backupCoordinates.lat,
        ]);
        return false;
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      marker.setLngLat([
        marker.userData.backupCoordinates.lng,
        marker.userData.backupCoordinates.lat,
      ]);
      return false;
    }
  }

  paintMarker(marker, color = MarkerManager.NORMAL_COLOR) {
    if (marker.getElement) {
      const element = marker.getElement();

      if (color === MarkerManager.DUPLICATED_COLOR) {
        element.style.backgroundColor = color;
      } else {
        element.style.backgroundColor = "";
      }
    } else {
      console.error("Marker does not support direct color changes.");
    }

    return marker;
  }
}
