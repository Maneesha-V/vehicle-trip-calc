import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginApi, logoutApi, registerApi, restoreSessionApi } from "../../services/authService";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import type { AuthPayload, LoginReq, RegisterReq, UserDTO } from "../../types/authTypes";
import type { MsgResponse, RejectValue } from "../../types/commonTypes";

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  loading: boolean;
  initialized: boolean; // true once the first session-restore attempt finished
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  initialized: false,
  error: null,
  message: null,
};

export const registerUser = createAsyncThunk<
  { message: string },
  RegisterReq,
  { rejectValue: RejectValue }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    const res = await registerApi(data);
    return { message: res.message ?? "Registered successfully" };
  } catch (err) {
    return rejectWithValue({ message: getAxiosErrorMessage(err) });
  }
});

export const loginUser = createAsyncThunk<
  AuthPayload,
  LoginReq,
  { rejectValue: RejectValue }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const res = await loginApi(data);
    console.log("res",res);
    
    return res.data;
  } catch (err) {
    return rejectWithValue({ message: getAxiosErrorMessage(err) });
  }
});

export const restoreSession = createAsyncThunk<AuthPayload, void, { rejectValue: RejectValue }>(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      return await restoreSessionApi();
    } catch (err) {
      return rejectWithValue({ message: getAxiosErrorMessage(err) });
    }
  },
);

export const logoutUser = createAsyncThunk<MsgResponse, void, { rejectValue: RejectValue }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (err) {
      return rejectWithValue({ message: getAxiosErrorMessage(err) });
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // used by the axios interceptor after a silent refresh
    setCredentials: (state, action: PayloadAction<AuthPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Registration failed";
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Login failed";
      })
      // restore session on app load (a failure is normal: user is just logged out)
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.initialized = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.initialized = true;
      })
      // logout: clear locally even if the API call fails
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { setCredentials, clearAuth, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;