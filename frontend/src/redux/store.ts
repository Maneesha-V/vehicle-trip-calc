import { configureStore } from "@reduxjs/toolkit";
import authReducer, { clearAuth, setCredentials } from "./slices/authSlice";
import tripReducer, { resetTrips } from "./slices/tripSlice";
import { injectAuthHandlers } from "../config/axiosClient";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// give axios access to the token without importing the store inside axiosClient
injectAuthHandlers({
  getToken: () => store.getState().auth.accessToken,
  onRefreshed: (payload) => store.dispatch(setCredentials(payload)),
  onAuthFailed: () => {
    store.dispatch(clearAuth());
    store.dispatch(resetTrips());
  },
});