import multer from "multer";
import { ApiError } from "../utils/ApiError";
import { STATUS_CODES } from "../utils/constantUtils";

export const uploadCsv = multer({
  storage: multer.memoryStorage(), // parsed straight from memory, nothing written to disk
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    const isCsv = /\.(csv|txt)$/i.test(file.originalname);
    if (!isCsv) return cb(new ApiError(STATUS_CODES.BAD_REQUEST, "Only .csv files are allowed"));
    cb(null, true);
  },
});