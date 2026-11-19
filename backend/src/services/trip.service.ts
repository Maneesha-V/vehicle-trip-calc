import { inject, injectable } from "inversify";
import { TYPES } from "../config/inversify/types";
import { ITripService } from "./interfaces/ITripService";
import { ITripRepository } from "../repositories/interfaces/ITripRepository";
import { IGpsPointRepository } from "../repositories/interfaces/IGpsPointRepository";
import { TripMapper } from "../mappers/TripMapper";
import {
  GpsPointDTO,
  TripDetailDTO,
  TripDTO,
  UploadInput,
  UploadTripResult,
} from "../types/trip.types";
import { ApiError } from "../utils/ApiError";
import { parseGpsCsv } from "../utils/gpsCsvParser";
import { calculateTrip } from "../utils/tripCalculator";
import { STATUS_CODES } from "../utils/constantUtils";

@injectable()
export class TripService implements ITripService {
  constructor(
    @inject(TYPES.TripRepository)
    private readonly tripRepository: ITripRepository,
    @inject(TYPES.GpsPointRepository)
    private readonly gpsPointRepository: IGpsPointRepository,
  ) {}

  async uploadTrip({
    userId,
    file,
    name,
    vehicleId,
  }: UploadInput): Promise<UploadTripResult> {
    if (!file)
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "CSV file is required (form field name: file)");

    const { points: rows, skippedRows } = parseGpsCsv(file.buffer);
    const { points, summary, stoppages, idlings, overspeeds } =
      calculateTrip(rows);

    const trip = await this.tripRepository.create({
      userId: userId as any,
      name: name?.trim() || file.originalname.replace(/\.[^.]+$/, ""),
      fileName: file.originalname,
      vehicleId: vehicleId?.trim() || "default",
      startTime: points[0].timestamp,
      endTime: points[points.length - 1].timestamp,
      pointCount: points.length, // after noise removal
      summary,
      stoppages,
      idlings,
      overspeeds,
    });

    const tripId = String(trip._id);
    try {
      await this.gpsPointRepository.insertManyForTrip(tripId, userId, points);
    } catch (err) {
      await this.gpsPointRepository.deleteByTrip(tripId);
      await this.tripRepository.deleteByIdAndUser(tripId, userId);
      throw err;
    }

    return { trip: TripMapper.mapTripDTO(trip), skippedRows };
  }

  async getTrips(userId: string): Promise<TripDTO[]> {
    return TripMapper.mapTripsDTO(await this.tripRepository.findByUser(userId));
  }

  async getTripWithPoints(
    tripId: string,
    userId: string,
  ): Promise<{ trip: TripDetailDTO; points: GpsPointDTO[] }> {
    const trip = await this.tripRepository.findByIdAndUser(tripId, userId);
    if (!trip) throw new ApiError(STATUS_CODES.NOT_FOUND, "Trip not found");

    const points = await this.gpsPointRepository.findByTrip(tripId, userId);
    return {
      trip: TripMapper.mapTripDetailDTO(trip),
      points: TripMapper.mapPointsDTO(points),
    };
  }

  async getTripReport(tripId: string, userId: string): Promise<TripDTO> {
    const trip = await this.tripRepository.findByIdAndUser(tripId, userId);
    if (!trip) throw new ApiError(STATUS_CODES.NOT_FOUND, "Trip not found");
    return TripMapper.mapTripDTO(trip);
  }
  
  async deleteTrip(tripId: string, userId: string): Promise<void> {
    const deleted = await this.tripRepository.deleteByIdAndUser(tripId, userId);
    if (!deleted) throw new ApiError(STATUS_CODES.NOT_FOUND, "Trip not found");
    await this.gpsPointRepository.deleteByTrip(tripId);
  }
}
