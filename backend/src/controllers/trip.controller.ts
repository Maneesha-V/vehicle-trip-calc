import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/inversify/types";
import type { ITripService } from "../services/interfaces/ITripService";
import type { ITripController } from "./interfaces/ITripController";

@injectable()
export class TripController implements ITripController {
  constructor(@inject(TYPES.TripService) private readonly tripService: ITripService) {}

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      
      const result = await this.tripService.uploadTrip({
        userId: req.userId as string,
        file: req.file,
        name: req.body?.name,
        vehicleId: req.body?.vehicleId,
      });
      res.status(201).json({ success: true, message: "Trip uploaded successfully", data: result });
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trips = await this.tripService.getTrips(req.userId as string);
      res.status(200).json({ success: true, data: trips });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.tripService.getTripWithPoints(
        String(req.params.id),
        req.userId as string,
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.tripService.deleteTrip(String(req.params.id), req.userId as string);
      res.status(200).json({ success: true, message: "Trip deleted" });
    } catch (err) {
      next(err);
    }
  };
  
  report = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await this.tripService.getTripReport(String(req.params.id), req.userId as string);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
}