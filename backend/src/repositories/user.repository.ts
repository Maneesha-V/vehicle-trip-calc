import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "./interfaces/IUserRepository";
import { IUser, User } from "../models/user.model";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }
  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<IUser | null> {
    const query = this.model.findOne({ email });
    if (includePassword) query.select("+password");
    return await query;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.updateOne({ _id: userId }, { refreshToken });
  }

  async findById(id: string, includeRefreshToken = false): Promise<IUser | null> {
    const query = this.model.findById(id);
    if (includeRefreshToken) query.select("+refreshToken");
    return await query;
  }
}
