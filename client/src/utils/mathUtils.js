export function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;
}

export function getDistanceBetweenPoints(point1, point2) {
  const R = 6371;
  const lat1 = deg2rad(point1.lat);
  const lat2 = deg2rad(point2.lat);
  const deltaLat = deg2rad(point2.lat - point1.lat);
  const deltaLng = deg2rad(point2.lng - point1.lng);

  const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function convertPaceToVelocity(minutes, seconds) {
  const totalMinutes = minutes + seconds / 60;
  return 60 / totalMinutes;
}
