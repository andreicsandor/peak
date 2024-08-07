export const UserLocation = {
  DEFAULT: [23.5899, 46.7697],
};

let userLocation = [...UserLocation.DEFAULT];

export function getUserLocation() {
  return userLocation;
}

export function setUserLocation(longitude, latitude) {
  userLocation = [longitude, latitude];
}
