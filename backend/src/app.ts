import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import tripRoutes from "./routes/trip.routes";

const app = express();

app.use(cors({ 
    origin: env.clientUrl, 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.use(errorHandler);

export default app;