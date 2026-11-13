export interface UserDTO {
  _id: string;
  name: string;
  email: string;
}

export interface RegisterReq {
  name: string;
  email: string;
  password: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface AuthPayload {
  accessToken: string;
  user: UserDTO;
}
export interface LoginPayload {
  message: string;
  success: boolean;
  data: AuthPayload
}