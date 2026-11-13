export interface ParsedGpsRow {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: boolean; 
}

export interface CsvParseResult {
  points: ParsedGpsRow[];
  skippedRows: number;
}

export interface TripDTO {
  _id: string;
  name: string;
  fileName: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  pointCount: number;
  summary: TripSummary;
  createdAt: Date;
}
export interface TripDetailDTO extends TripDTO {
  stoppages: TripEvent[];
  idlings: TripEvent[];
  overspeeds: OverspeedSegment[];
}

export interface GpsPointDTO {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: boolean;
  speed: number;
  isOverspeed: boolean;
}

export interface UploadTripResult {
  trip: TripDTO;
  skippedRows: number;
}

export interface UploadInput {
  userId: string;
  file?: Express.Multer.File;
  name?: string;
  vehicleId?: string;
}

export interface CalculatedPoint extends ParsedGpsRow {
  speed: number;        // km/h, speed of the segment ending at this point
  isOverspeed: boolean;
}

export interface TripEvent {
  startIndex: number;   // index into the trip's ordered points
  endIndex: number;
  startTime: Date;
  endTime: Date;
  durationSec: number;
  latitude: number;     // where it started
  longitude: number;
}

export interface OverspeedSegment extends TripEvent {
  maxSpeed: number;
}

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

export interface CalculationResult {
  points: CalculatedPoint[];
  summary: TripSummary;
  stoppages: TripEvent[];
  idlings: TripEvent[];
  overspeeds: OverspeedSegment[];
}
