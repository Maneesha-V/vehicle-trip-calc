export const TYPES = {
  // config values
  JwtSecret: Symbol.for("JwtSecret"),
  JwtExpiresIn: Symbol.for("JwtExpiresIn"),

  // infrastructure
  UserRepository: Symbol.for("UserRepository"),
  TripRepository: Symbol.for("TripRepository"),
  GpsPointRepository: Symbol.for("GpsPointRepository"),

  // services
  AuthService: Symbol.for("AuthService"),
  TripService: Symbol.for("TripService"),

  // controllers / middleware
  AuthController: Symbol.for("AuthController"),
  TripController: Symbol.for("TripController"),
};