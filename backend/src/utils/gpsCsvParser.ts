import { parse as csvParse } from "csv-parse/sync";
import { CsvParseResult, ParsedGpsRow } from "../types/trip.types";
import { ApiError } from "./ApiError";
import { STATUS_CODES } from "./constantUtils";

const MIN_POINTS = 2;
const TZ_SUFFIX = /(Z|[+-]\d{2}:?\d{2})$/i;
const IGNITION_ON = ["on", "1", "true"];
const IGNITION_OFF = ["off", "0", "false"];

const parseRow = (cols: string[]): ParsedGpsRow | null => {
  if (cols.length < 4) return null;
  const [latRaw, lngRaw, tsRaw, ignRaw] = cols;

  const latitude = Number(latRaw);
  const longitude = Number(lngRaw);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null;
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null;

  // "2024-09-07 10:29:27" has no timezone, so treat it as UTC (same result on every server)
  let iso = tsRaw.replace(" ", "T");
  if (!TZ_SUFFIX.test(iso)) iso += "Z";
  const timestamp = new Date(iso);
  if (Number.isNaN(timestamp.getTime())) return null;

  const ign = ignRaw.toLowerCase();
  let ignition: boolean;
  if (IGNITION_ON.includes(ign)) ignition = true;
  else if (IGNITION_OFF.includes(ign)) ignition = false;
  else return null;

  return { latitude, longitude, timestamp, ignition };
};

export const parseGpsCsv = (buffer: Buffer): CsvParseResult => {
  const text = buffer.toString("utf-8").replace(/^\uFEFF/, "");
  if (!text.trim()) throw new ApiError(STATUS_CODES.BAD_REQUEST, "CSV file is empty");

  const firstLine = text.split(/\r?\n/, 1)[0];
  const delimiter = firstLine.includes("\t") ? "\t" : ",";

  let records: string[][];
  try {
    records = csvParse(text, {
      delimiter,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });
  } catch {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Unable to read CSV file. Check the format.");
  }

  // if the first value of the first row isn't a number, it's a header
  const start = records.length > 0 && Number.isNaN(Number(records[0][0])) ? 1 : 0;

  const points: ParsedGpsRow[] = [];
  let skippedRows = 0;

  for (let i = start; i < records.length; i++) {
    const row = parseRow(records[i]);
    if (row) points.push(row);
    else skippedRows++;
  }

  if (points.length < MIN_POINTS) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, `CSV needs at least ${MIN_POINTS} valid GPS rows`);
  }

  points.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return { points, skippedRows };
};