import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse } from "../types/commonTypes";
import type { AuthPayload } from "../types/authTypes";

const baseURL = import.meta.env.VITE_API_URL as string;

// no interceptors: used for login/register/refresh
export const axiosPublic = axios.create({ baseURL, withCredentials: true });
// attaches the access token and refreshes on 401
export const axiosPrivate = axios.create({ baseURL, withCredentials: true });

interface AuthHandlers {
  getToken: () => string | null;
  onRefreshed: (payload: AuthPayload) => void;
  onAuthFailed: () => void;
}

let handlers: AuthHandlers | null = null;
export const injectAuthHandlers = (h: AuthHandlers) => {
  handlers = h;
};

// concurrent 401s share one refresh call
let refreshPromise: Promise<AuthPayload> | null = null;

export const refreshSession = (): Promise<AuthPayload> => {
  if (!refreshPromise) {
    refreshPromise = axiosPublic
      .post<ApiResponse<AuthPayload>>(API_ROUTES.AUTH.REFRESH)
      .then((res) => res.data.data)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosPrivate.interceptors.request.use((config) => {
  const token = handlers?.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      const payload = await refreshSession();
      handlers?.onRefreshed(payload);
      original.headers.Authorization = `Bearer ${payload.accessToken}`;
      return axiosPrivate(original);
    } catch (refreshError) {
      handlers?.onAuthFailed();
      return Promise.reject(refreshError);
    }
  },
);