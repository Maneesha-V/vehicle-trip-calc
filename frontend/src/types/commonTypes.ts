export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface MsgResponse {
  success: boolean;
  message: string;
}

export interface RejectValue {
  message: string;
}