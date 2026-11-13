import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IGpsPointRepository } from "./interfaces/IGpsPointRepository";
import { GpsPoint, IGpsPoint } from "../models/gpsPoint.model";
import { CalculatedPoint } from "../types/trip.types";
import { Model } from "mongoose";

const BATCH_SIZE = 5000;

@injectable()
export class GpsPointRepository
  extends BaseRepository<IGpsPoint>
  implements IGpsPointRepository
{
  constructor( model: Model<IGpsPoint>) {
    super(model);
  }

  async insertManyForTrip(tripId: string, userId: string, rows: CalculatedPoint[]): Promise<void> {
    // batches keep memory and BSON message size under control for big files
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE).map((row) => ({ tripId, userId, ...row }));
      await this.model.insertMany(batch, { ordered: true });
    }
  }

  async findByTrip(tripId: string, userId: string): Promise<IGpsPoint[]> {
    return await this.model.find({ tripId, userId }).sort({ timestamp: 1 }).exec();
  }

  async deleteByTrip(tripId: string): Promise<void> {
    await this.model.deleteMany({ tripId }).exec();
  }
}