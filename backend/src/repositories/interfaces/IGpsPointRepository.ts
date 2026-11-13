import { IBaseRepository } from "./IBaseRepository";
import { IGpsPoint } from "../../models/gpsPoint.model";
import { CalculatedPoint } from "../../types/trip.types";

export interface IGpsPointRepository extends IBaseRepository<IGpsPoint> {
  insertManyForTrip(tripId: string, userId: string, rows: CalculatedPoint[]): Promise<void>;
  findByTrip(tripId: string, userId: string): Promise<IGpsPoint[]>;
  deleteByTrip(tripId: string): Promise<void>;
}