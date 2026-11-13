import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI as string,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

if (!env.mongoUri) {
  throw new Error("Missing MONGO_URI in .env");
}