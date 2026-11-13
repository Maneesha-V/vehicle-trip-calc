import type { GpsPointDTO, TripDetailDTO, TripEvent } from "../types/tripTypes";
import { pathDistance } from "./geo";

export type EventKind = "stoppage" | "idle" | "overspeed";

export interface EventRow {
  id: string;
  kind: EventKind;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  ignition: boolean;
  speed: number;
  durationSec: number;
  distanceMeters: number;
}

export const EVENT_LABEL: Record<EventKind, string> = {
  stoppage: "Stopped",
  idle: "Idle",
  overspeed: "Over speeding",
};

const base = (kind: EventKind, e: TripEvent, i: number) => ({
  id: `${kind}-${i}`,
  kind,
  startTime: e.startTime,
  endTime: e.endTime,
  latitude: e.latitude,
  longitude: e.longitude,
  durationSec: e.durationSec,
});

export const buildEventRows = (trip: TripDetailDTO, points: GpsPointDTO[]): EventRow[] => {
  const rows: EventRow[] = [
    ...trip.stoppages.map((e, i) => ({
      ...base("stoppage", e, i), ignition: false, speed: 0, distanceMeters: 0,
    })),
    ...trip.idlings.map((e, i) => ({
      ...base("idle", e, i), ignition: true, speed: 0, distanceMeters: 0,
    })),
    ...trip.overspeeds.map((e, i) => ({
      ...base("overspeed", e, i),
      ignition: true,
      speed: e.maxSpeed,
      distanceMeters: pathDistance(points, e.startIndex, e.endIndex),
    })),
  ];
  return rows.sort((a, b) => a.startTime.localeCompare(b.startTime));
};