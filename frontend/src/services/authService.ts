import { axiosPublic, refreshSession } from "../config/axiosClient";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse, MsgResponse } from "../types/commonTypes";
import type { AuthPayload, LoginReq, RegisterReq, UserDTO } from "../types/authTypes";

export const registerApi = async (data: RegisterReq) => {
  const res = await axiosPublic.post<ApiResponse<UserDTO>>(API_ROUTES.AUTH.REGISTER, data);
  return res.data;
};

export const loginApi = async (data: LoginReq) => {
  const res = await axiosPublic.post<ApiResponse<AuthPayload>>(API_ROUTES.AUTH.LOGIN, data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await axiosPublic.post<MsgResponse>(API_ROUTES.AUTH.LOGOUT);
  return res.data;
};

export const restoreSessionApi = () => refreshSession();