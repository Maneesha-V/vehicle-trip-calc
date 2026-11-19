import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";
import { TokenPayload } from "../types/user.types";
import { STATUS_CODES } from "./constantUtils";

export const generateAccessToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

export const generateRefreshToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  } catch {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid or expired refresh token");
  }
};
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
  } catch {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid or expired access token");
  }
};