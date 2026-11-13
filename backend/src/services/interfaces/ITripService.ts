import { GpsPointDTO, TripDetailDTO, TripDTO, UploadInput, UploadTripResult } from "../../types/trip.types";

export interface ITripService {
  uploadTrip(input: UploadInput): Promise<UploadTripResult>;
  getTrips(userId: string): Promise<TripDTO[]>;
  getTripWithPoints(tripId: string, userId: string): Promise<{ trip: TripDetailDTO; points: GpsPointDTO[] }>;
  getTripReport(tripId: string, userId: string): Promise<TripDTO>;
  deleteTrip(tripId: string, userId: string): Promise<void>;
}