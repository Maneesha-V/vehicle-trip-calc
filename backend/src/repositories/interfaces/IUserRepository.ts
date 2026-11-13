import { IUser } from "../../models/user.model";
import type { IBaseRepository } from "../interfaces/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string, includePassword?: boolean): Promise<IUser | null>;
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
  findById(id: string, includeRefreshToken?: boolean): Promise<IUser | null>;
}