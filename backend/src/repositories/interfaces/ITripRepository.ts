import { IBaseRepository } from "./IBaseRepository";
import { ITrip } from "../../models/trip.model";

export interface ITripRepository extends IBaseRepository<ITrip> {
  findByUser(userId: string): Promise<ITrip[]>;
  findByIdAndUser(tripId: string, userId: string): Promise<ITrip | null>;
  deleteByIdAndUser(tripId: string, userId: string): Promise<boolean>;
}