export const Modes = {
  ADD_WAYPOINT: "addWaypoint",
  DUPLICATE_WAYPOINT: "duplicateWaypoint",
  DELETE_WAYPOINT: "deleteWaypoint",
  DEACTIVATED: "deactivated",
};

let mode = Modes.ADD_WAYPOINT;

export function getCurrentMode() {
  return mode;
}

export function setCurrentMode(newMode) {
  mode = newMode;
}
