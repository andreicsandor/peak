export const UserLocation = {
  DEFAULT: [-74.0060, 40.7128],
};

let userLocation = [...UserLocation.DEFAULT];

export function getUserLocation() {
  return userLocation;
}

export function setUserLocation(longitude, latitude) {
  userLocation = [longitude, latitude];
}
