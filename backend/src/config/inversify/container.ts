import { Container } from "inversify";
import { TYPES } from "./types";
import { IAuthController } from "../../controllers/interfaces/IAuthController";
import { AuthController } from "../../controllers/auth.controller";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { UserRepository } from "../../repositories/user.repository";
import { IAuthService } from "../../services/interfaces/IAuthService";
import { AuthService } from "../../services/auth.service";
import { TripRepository } from "../../repositories/trip.repository";
import { ITripRepository } from "../../repositories/interfaces/ITripRepository";
import { ITripService } from "../../services/interfaces/ITripService";
import { TripService } from "../../services/trip.service";
import { ITripController } from "../../controllers/interfaces/ITripController";
import { TripController } from "../../controllers/trip.controller";
import { GpsPointRepository } from "../../repositories/gpsPoint.repository";
import { IGpsPointRepository } from "../../repositories/interfaces/IGpsPointRepository";

const container = new Container();

// Repository
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository);
container
  .bind<ITripRepository>(TYPES.TripRepository)
  .to(TripRepository);
container
  .bind<IGpsPointRepository>(TYPES.GpsPointRepository)
  .to(GpsPointRepository);

  // Service
container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService);
container
  .bind<ITripService>(TYPES.TripService)
  .to(TripService);

// Controller
container
  .bind<IAuthController>(TYPES.AuthController)
  .to(AuthController);
container
  .bind<ITripController>(TYPES.TripController)
  .to(TripController);

export default container;