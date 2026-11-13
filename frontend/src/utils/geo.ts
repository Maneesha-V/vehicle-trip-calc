import type { GpsPointDTO } from "../types/tripTypes";

const EARTH_RADIUS_M = 6371008.8;
const rad = (d: number) => (d * Math.PI) / 180;

export const haversine = (a: GpsPointDTO, b: GpsPointDTO): number => {
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
};

export const pathDistance = (points: GpsPointDTO[], start: number, end: number): number => {
  let total = 0;
  for (let i = start + 1; i <= end; i++) total += haversine(points[i - 1], points[i]);
  return total;
};