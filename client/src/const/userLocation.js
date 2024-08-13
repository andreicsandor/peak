export const UserLocation = {
  DEFAULT: [40.7128, -74.006],
};

let userLocation = [...UserLocation.DEFAULT];

export function getUserLocation() {
  return userLocation;
}

export function setUserLocation(longitude, latitude) {
  userLocation = [longitude, latitude];
}
