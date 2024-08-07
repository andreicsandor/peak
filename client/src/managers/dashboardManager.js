export class DashboardManager {
  constructor(map) {
    this.map = map;
  }

  displayRoute(routeData, elevationGain) {
    const { geometry, distance, duration } = routeData;

    const infoWrapper = document.querySelector(".dashboard-info-wrapper");

    let distanceDisplay;
    let distanceNaming;
    if (distance < 1000) {
      distanceDisplay = `${distance.toFixed(0)}`;
      distanceNaming = "Meters";
    } else if (distance === 1000) {
      distanceDisplay = `${distance.toFixed(0)}`;
      distanceNaming = "Kilometer";
    } else {
      distanceDisplay = `${(distance / 1000).toFixed(1)}`;
      distanceNaming = "Kilometers";
    }

    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = duration % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let hoursDisplay = hours > 0 ? `${hours}` : "";
    let hoursNaming = hours > 0 ? `Hour${hours > 1 ? "s" : ""}` : "";
    let minutesDisplay = minutes > 0 ? `${minutes}` : "";
    let minutesNaming = minutes > 0 ? `Minute${minutes > 1 ? "s" : ""}` : "";
    let secondsDisplay = totalSeconds > 0 ? `${totalSeconds.toFixed(0)}` : "";
    let secondsNaming =
      totalSeconds > 0 ? `Second${totalSeconds > 1 ? "s" : ""}` : "";

    let elevationDisplay;
    let elevationNaming;
    if (elevationGain < 1000) {
      elevationDisplay = `${elevationGain.toFixed(
        0
      )}<span class="dashboard-info-small-value"> m</span>`;
      elevationNaming = "Elevation";
    } else if (elevationGain === 1000) {
      elevationDisplay = `${elevationGain.toFixed(
        0
      )}<span class="dashboard-info-small-value"> km</span>`;
      elevationNaming = "Elevation";
    } else {
      elevationDisplay = `${(elevationGain / 1000).toFixed(
        1
      )}<span class="dashboard-info-small-value"> km</span>`;
      elevationNaming = "Elevation";
    }

    infoWrapper.innerHTML = `
      <div class="dashboard-info-container">
        <div class="dashboard-info-item">
          <div class="dashboard-info-value">
            ${distanceDisplay}
          </div>
          <div class="dashboard-info-title">${distanceNaming}</div>
        </div>
        <div class="dashboard-info-item ${hoursDisplay ? "" : "hidden"}">
          <div class="dashboard-info-value">
            ${hoursDisplay}
          </div>
          <div class="dashboard-info-title">${hoursNaming}</div>
        </div>
        <div class="dashboard-info-item ${minutesDisplay ? "" : "hidden"}">
          <div class="dashboard-info-value">
            ${minutesDisplay}
          </div>
          <div class="dashboard-info-title">${minutesNaming}</div>
        </div>
        <div class="dashboard-info-item ${secondsDisplay ? "" : "hidden"}">
          <div class="dashboard-info-value">
            ${secondsDisplay}
          </div>
          <div class="dashboard-info-title">${secondsNaming}</div>
        </div>
        <div class="dashboard-info-item">
          <div class="dashboard-info-value">
            ${elevationDisplay}
          </div>
          <div class="dashboard-info-title">${elevationNaming}</div>
        </div>
      </div>
    `;

    infoWrapper.classList.add("unhidden");

    if (this.map.getSource("route")) {
      this.map.getSource("route").setData(geometry);
    } else {
      this.map.addSource("route", { type: "geojson", data: geometry });
      this.map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ff7e5f", "line-width": 4 },
      });
    }
  }

  clearRoute() {
    const infoWrapper = document.querySelector(".dashboard-info-wrapper");

    infoWrapper.classList.remove("unhidden");
    infoWrapper.innerHTML = "";

    if (this.map.getLayer("route")) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }
  }
}
