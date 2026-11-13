// export class ApiError extends Error {
//   constructor(public statusCode: number, message: string) {
//     super(message);
//   }
// }
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}