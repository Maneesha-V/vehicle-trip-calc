import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { ITripRepository } from "./interfaces/ITripRepository";
import { ITrip, Trip } from "../models/trip.model";

@injectable()
export class TripRepository extends BaseRepository<ITrip> implements ITripRepository {
  constructor() {
    super(Trip);
  }

  async findByUser(userId: string): Promise<ITrip[]> {
    return await this.model
    .find({ userId })
    .select("-stoppages -idlings -overspeeds")
    .sort({ createdAt: -1 })
    .exec();
  }

  async findByIdAndUser(tripId: string, userId: string): Promise<ITrip | null> {
    if (!Types.ObjectId.isValid(tripId)) return null;
    return await this.model.findOne({ _id: tripId, userId }).exec();
  }

  async deleteByIdAndUser(tripId: string, userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(tripId)) return false;
    const result = await this.model.deleteOne({ _id: tripId, userId }).exec();
    return result.deletedCount === 1;
  }
}