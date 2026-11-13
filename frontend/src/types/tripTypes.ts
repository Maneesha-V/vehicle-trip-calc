export interface TripSummary {
  totalDistanceMeters: number;
  totalDurationSec: number;
  movingDurationSec: number;
  idlingDurationSec: number;
  stoppageDurationSec: number;
  overspeedDurationSec: number;
  maxSpeed: number;
  avgMovingSpeed: number;
  stoppageCount: number;
  idlingCount: number;
  overspeedCount: number;
  discardedPoints: number;
}

export interface TripEvent {
  startIndex: number;
  endIndex: number;
  startTime: string;
  endTime: string;
  durationSec: number;
  latitude: number;
  longitude: number;
}

export interface OverspeedSegment extends TripEvent {
  maxSpeed: number;
}

export interface TripDTO {
  _id: string;
  name: string;
  fileName: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  pointCount: number;
  summary: TripSummary;
  createdAt: string;
}

export interface TripDetailDTO extends TripDTO {
  stoppages: TripEvent[];
  idlings: TripEvent[];
  overspeeds: OverspeedSegment[];
}

export interface GpsPointDTO {
  latitude: number;
  longitude: number;
  timestamp: string;
  ignition: boolean;
  speed: number;
  isOverspeed: boolean;
}

export interface TripWithPoints {
  trip: TripDetailDTO;
  points: GpsPointDTO[];
}

export interface UploadTripReq {
  file: File;
  name?: string;
  vehicleId?: string;
}

export interface UploadTripResp {
  trip: TripDTO;
  skippedRows: number;
}