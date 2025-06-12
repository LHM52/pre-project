import type { Place } from "../types/types";

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R: number = 6371;
  const dLat: number = toRad(lat2 - lat1);
  const dLon: number = toRad(lng2 - lng1);
  const l1: number = toRad(lat1);
  const l2: number = toRad(lat2);

  const a: number =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d: number = R * c;
  return d;
}

export function sortPlacesByDistance(places: Place[], lat: number, lon: number): Place[] {
  const sortedPlaces: Place[] = [...places];
  sortedPlaces.sort((a, b) => {
    const distanceA: number = calculateDistance(lat, lon, a.lat, a.lon);
    const distanceB: number = calculateDistance(lat, lon, b.lat, b.lon);
    return distanceA - distanceB;
  });
  return sortedPlaces;
}