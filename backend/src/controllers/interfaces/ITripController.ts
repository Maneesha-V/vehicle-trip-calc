import { Request, Response, NextFunction } from "express";

export interface ITripController {
  upload(req: Request, res: Response, next: NextFunction): Promise<void>;
  list(req: Request, res: Response, next: NextFunction): Promise<void>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;
  remove(req: Request, res: Response, next: NextFunction): Promise<void>;
  report(req: Request, res: Response, next: NextFunction): Promise<void>;
}