import { Schema, model, Document, Types } from "mongoose";
import { OverspeedSegment, TripEvent, TripSummary } from "../types/trip.types";

export interface ITrip extends Document {
  userId: Types.ObjectId;
  name: string;
  fileName: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  pointCount: number;
  summary: TripSummary;
  stoppages: TripEvent[];
  idlings: TripEvent[];
  overspeeds: OverspeedSegment[];
  createdAt: Date;
  updatedAt: Date;
}

const num = { type: Number, required: true };

const summarySchema = new Schema<TripSummary>(
  {
    totalDistanceMeters: num,
    totalDurationSec: num,
    movingDurationSec: num,
    idlingDurationSec: num,
    stoppageDurationSec: num,
    overspeedDurationSec: num,
    maxSpeed: num,
    avgMovingSpeed: num,
    stoppageCount: num,
    idlingCount: num,
    overspeedCount: num,
    discardedPoints: num,
  },
  { _id: false },
);

const eventFields = {
  startIndex: num,
  endIndex: num,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationSec: num,
  latitude: num,
  longitude: num,
};

const eventSchema = new Schema<TripEvent>(eventFields, { _id: false });
const overspeedSchema = new Schema<OverspeedSegment>(
  { ...eventFields, maxSpeed: num },
  { _id: false },
);

const tripSchema = new Schema<ITrip>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    vehicleId: { type: String, default: "default", trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    pointCount: { type: Number, required: true },
    summary: { type: summarySchema, required: true },
    stoppages: { type: [eventSchema], default: [] },
    idlings: { type: [eventSchema], default: [] },
    overspeeds: { type: [overspeedSchema], default: [] },
  },
  { timestamps: true },
);

tripSchema.index({ userId: 1, createdAt: -1 });

tripSchema.index({ userId: 1, vehicleId: 1, startTime: -1 });

export const Trip = model<ITrip>("Trip", tripSchema);