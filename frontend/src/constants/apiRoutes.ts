export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
  },
  TRIPS: {
    BASE: "/trips",
    UPLOAD: "/trips/upload",
    BY_ID: (id: string) => `/trips/${id}`,
  },
} as const;