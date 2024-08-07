export const LocationPermission = {
    LOCATION_ENABLED: "locationEnabled",
    LOCATION_DISABLED: "locationDisabled",
  };
  
  let permission = LocationPermission.LOCATION_DISABLED;
  
  export function getLocationPermission() {
    return permission;
  }
  
  export function setLocationPermission(newPermission) {
    permission = newPermission;
  }
  