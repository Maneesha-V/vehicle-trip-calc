import multer from "multer";
import { ApiError } from "../utils/ApiError";

export const uploadCsv = multer({
  storage: multer.memoryStorage(), // parsed straight from memory, nothing written to disk
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    const isCsv = /\.(csv|txt)$/i.test(file.originalname);
    if (!isCsv) return cb(new ApiError(400, "Only .csv files are allowed"));
    cb(null, true);
  },
});