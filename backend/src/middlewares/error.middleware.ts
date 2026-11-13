import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import multer from "multer";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large (max 10 MB)"
        : err.message;
    return res.status(400).json({ success: false, message });
  }
  if ((err as any).code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value" });
  }
  
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
