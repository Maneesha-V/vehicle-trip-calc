// middlewares/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";
import { STATUS_CODES } from "../utils/constantUtils";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Authentication required");
    req.userId = verifyAccessToken(header.split(" ")[1]).userId;
    next();
  } catch (err) {
    next(err);
  }
};