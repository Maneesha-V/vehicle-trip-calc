import { Schema, model, Document, Types } from "mongoose";

export interface IGpsPoint extends Document {
  tripId: Types.ObjectId;
  userId: Types.ObjectId;
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: boolean;
  speed: number;
  isOverspeed: boolean;
}

const gpsPointSchema = new Schema<IGpsPoint>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    ignition: { type: Boolean, required: true },
    speed: { type: Number, required: true, default: 0 },
    isOverspeed: { type: Boolean, required: true, default: false },
  },
  { versionKey: false },
);

gpsPointSchema.index({ tripId: 1, timestamp: 1 });
gpsPointSchema.index({ userId: 1 });

export const GpsPoint = model<IGpsPoint>("GpsPoint", gpsPointSchema);