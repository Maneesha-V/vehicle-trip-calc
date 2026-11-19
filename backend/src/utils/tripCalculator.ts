import { getDistance } from "geolib";
import {
  CalculatedPoint,
  CalculationResult,
  OverspeedSegment,
  ParsedGpsRow,
  TripEvent,
} from "../types/trip.types";
import { ApiError } from "./ApiError";
import { STATUS_CODES } from "./constantUtils";

const OVERSPEED_KMH = 60;
const MAX_PLAUSIBLE_KMH = 200; // faster than this between two points = GPS glitch
const MIN_MOVING_KMH = 1; // below this = GPS drift, treat as standing still
const MS_TO_KMH = 3.6;

type SegmentState = "stoppage" | "idling" | "moving";

const meters = (a: ParsedGpsRow, b: ParsedGpsRow): number =>
  getDistance(
    { latitude: a.latitude, longitude: a.longitude },
    { latitude: b.latitude, longitude: b.longitude },
  );

const seconds = (a: ParsedGpsRow, b: ParsedGpsRow): number =>
  (b.timestamp.getTime() - a.timestamp.getTime()) / 1000;

const round1 = (n: number): number => Math.round(n * 10) / 10;

/** Drops duplicate-timestamp points and impossible jumps. Input must be time-sorted. */
const removeNoise = (rows: ParsedGpsRow[]): { clean: ParsedGpsRow[]; discarded: number } => {
  const clean: ParsedGpsRow[] = [rows[0]];
  let discarded = 0;

  for (let i = 1; i < rows.length; i++) {
    const last = clean[clean.length - 1];
    const dt = seconds(last, rows[i]);
    if (dt <= 0 || (meters(last, rows[i]) / dt) * MS_TO_KMH > MAX_PLAUSIBLE_KMH) {
      discarded++;
      continue;
    }
    clean.push(rows[i]);
  }
  return { clean, discarded };
};

const toEvent = (points: CalculatedPoint[], startIndex: number, endIndex: number): TripEvent => {
  const start = points[startIndex];
  const end = points[endIndex];
  return {
    startIndex,
    endIndex,
    startTime: start.timestamp,
    endTime: end.timestamp,
    durationSec: Math.round(seconds(start, end)),
    latitude: start.latitude,
    longitude: start.longitude,
  };
};

export const calculateTrip = (rows: ParsedGpsRow[]): CalculationResult => {
  const { clean, discarded } = removeNoise(rows);
  if (clean.length < 2) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Not enough valid GPS points after cleaning");

  const points: CalculatedPoint[] = clean.map((r) => ({ ...r, speed: 0, isOverspeed: false }));
  const last = points.length - 1;

  const stoppages: TripEvent[] = [];
  const idlings: TripEvent[] = [];
  const overspeeds: OverspeedSegment[] = [];

  let totalDistance = 0;
  let movingSec = 0;
  let idlingSec = 0;
  let stoppageSec = 0;
  let maxSpeed = 0;

  // currently open stoppage/idling run, and currently open overspeed run
  let run: { state: "stoppage" | "idling"; startIndex: number } | null = null;
  let over: { startIndex: number; maxSpeed: number } | null = null;

  const closeRun = (endIndex: number) => {
    if (!run) return;
    (run.state === "stoppage" ? stoppages : idlings).push(toEvent(points, run.startIndex, endIndex));
    run = null;
  };

  const closeOver = (endIndex: number) => {
    if (!over) return;
    overspeeds.push({
      ...toEvent(points, over.startIndex, endIndex),
      maxSpeed: round1(over.maxSpeed),
    });
    over = null;
  };

  for (let i = 1; i <= last; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dt = seconds(prev, curr); // always > 0 after noise removal
    const dist = meters(prev, curr);

    let speed = (dist / dt) * MS_TO_KMH;
    if (speed < MIN_MOVING_KMH) speed = 0;

    const state: SegmentState = !prev.ignition ? "stoppage" : speed === 0 ? "idling" : "moving";

    // ---- totals ----
    if (state === "stoppage") {
      stoppageSec += dt;
      speed = 0; // the device may jump while off; not real driving
    } else if (state === "idling") {
      idlingSec += dt;
    } else {
      movingSec += dt;
      totalDistance += dist;
      maxSpeed = Math.max(maxSpeed, speed);
    }
    curr.speed = round1(speed);

    // ---- stoppage / idling runs (consecutive same-state segments merge into one event) ----
    if (state === "moving") {
      closeRun(i - 1);
    } else if (!run || run.state !== state) {
      closeRun(i - 1);
      run = { state, startIndex: i - 1 };
    }

    // ---- overspeed runs ----
    if (state === "moving" && speed > OVERSPEED_KMH) {
      curr.isOverspeed = true;
      if (!over) over = { startIndex: i - 1, maxSpeed: speed };
      else over.maxSpeed = Math.max(over.maxSpeed, speed);
    } else {
      closeOver(i - 1);
    }
  }

  closeRun(last);
  closeOver(last);

  return {
    points,
    stoppages,
    idlings,
    overspeeds,
    summary: {
      totalDistanceMeters: Math.round(totalDistance),
      totalDurationSec: Math.round(seconds(points[0], points[last])),
      movingDurationSec: Math.round(movingSec),
      idlingDurationSec: Math.round(idlingSec),
      stoppageDurationSec: Math.round(stoppageSec),
      overspeedDurationSec: overspeeds.reduce((sum, o) => sum + o.durationSec, 0),
      maxSpeed: round1(maxSpeed),
      avgMovingSpeed: movingSec > 0 ? round1((totalDistance / movingSec) * MS_TO_KMH) : 0,
      stoppageCount: stoppages.length,
      idlingCount: idlings.length,
      overspeedCount: overspeeds.length,
      discardedPoints: discarded,
    },
  };
};