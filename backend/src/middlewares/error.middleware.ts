import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import multer from "multer";
import { STATUS_CODES } from "../utils/constantUtils";

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
    return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message });
  }
  if ((err as any).code === 11000) {
    return res.status(STATUS_CODES.CONFLICT).json({ success: false, message: "Duplicate value" });
  }
  
  return res.status(STATUS_CODES.SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
  });
};
