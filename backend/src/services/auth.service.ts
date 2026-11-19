import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import type { IAuthService } from "./interfaces/IAuthService";
import { ApiError } from "../utils/ApiError";
import { TYPES } from "../config/inversify/types";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IUser } from "../models/user.model";
import { AuthResult, AuthTokens, RefreshResult } from "../types/user.types";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { UserMapper } from "../mappers/UserMapper";
import { STATUS_CODES } from "../utils/constantUtils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  private async issueTokens(user: IUser): Promise<AuthTokens> {
    const userId = String(user._id);
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    await this.userRepository.updateRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Name is required");
    if (!EMAIL_REGEX.test(cleanEmail)) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email address");
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const existingUser = await this.userRepository.findByEmail(cleanEmail);
    if (existingUser) throw new ApiError(STATUS_CODES.CONFLICT, "Email already exists");

    const user = await this.userRepository.create({
      name: cleanName,
      email: cleanEmail,
      password: await bcrypt.hash(password, 10),
    });

    const tokens = await this.issueTokens(user);

    return { 
      user: UserMapper.mapUserDTO(user), 
      ...tokens 
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email.trim().toLowerCase(), true);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid email or password");
    }

    const tokens = await this.issueTokens(user);
    return { user: UserMapper.mapUserDTO(user), ...tokens };
  }

  async logout(token?: string): Promise<void> {
    if (!token) return;

    let userId: string;
    try {
      userId = verifyRefreshToken(token).userId;
    } catch {
      return; 
    }
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async refreshToken(token?: string): Promise<RefreshResult> {
    if (!token) throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Refresh token missing");

    const { userId } = verifyRefreshToken(token);
    const user = await this.userRepository.findById(userId);

    if (!user || user.refreshToken !== token) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid refresh token");
    }

    return {
      accessToken: generateAccessToken(userId),
      user: UserMapper.mapUserDTO(user),
    };
  }
}