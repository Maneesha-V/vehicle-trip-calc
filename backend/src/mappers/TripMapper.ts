import { ITrip } from "../models/trip.model";
import { IGpsPoint } from "../models/gpsPoint.model";
import { GpsPointDTO, TripDetailDTO, TripDTO } from "../types/trip.types";

export class TripMapper {
  static mapTripDTO(doc: ITrip): TripDTO {
    const { summary } = doc.toObject();
    return {
      _id: doc._id.toString(),
      name: doc.name,
      fileName: doc.fileName,
      vehicleId: doc.vehicleId,
      startTime: doc.startTime,
      endTime: doc.endTime,
      pointCount: doc.pointCount,
      summary,
      createdAt: doc.createdAt,
    };
  }

  static mapTripDetailDTO(doc: ITrip): TripDetailDTO {
    const { stoppages, idlings, overspeeds } = doc.toObject();
    return { ...this.mapTripDTO(doc), stoppages, idlings, overspeeds };
  }

  static mapTripsDTO(docs: ITrip[]): TripDTO[] {
    return docs.map((d) => this.mapTripDTO(d));
  }

  static mapPointDTO(doc: IGpsPoint): GpsPointDTO {
    return {
      latitude: doc.latitude,
      longitude: doc.longitude,
      timestamp: doc.timestamp,
      ignition: doc.ignition,
      speed: doc.speed,
      isOverspeed: doc.isOverspeed,
    };
  }

  static mapPointsDTO(docs: IGpsPoint[]): GpsPointDTO[] {
    return docs.map((d) => this.mapPointDTO(d));
  }
}