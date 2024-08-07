import { getUserLocation } from "../const/userLocation";

export function getCurrentDateTime() {
  const now = new Date();
  const [lon, lat] = getUserLocation();
  const datetime = now.toISOString();

  return { lat, lon, datetime };
}