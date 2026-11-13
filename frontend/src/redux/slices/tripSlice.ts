import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  deleteTripApi,
  getTripByIdApi,
  getTripsApi,
  uploadTripApi,
} from "../../services/tripService";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import type { RejectValue } from "../../types/commonTypes";
import type {
  TripDTO,
  TripWithPoints,
  UploadTripReq,
  UploadTripResp,
} from "../../types/tripTypes";
import type { RootState } from "../store";

interface TripState {
  trips: TripDTO[];
  details: Record<string, TripWithPoints>; // cache: tripId -> trip + points
  selectedIds: string[]; // trips drawn on the map
  activeTripId: string | null; // trip whose report tab is open
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  details: {},
  selectedIds: [],
  activeTripId: null,
  loading: false,
  uploading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk<
  TripDTO[],
  void,
  { rejectValue: RejectValue }
>("trips/fetchTrips", async (_, { rejectWithValue }) => {
  try {
    return (await getTripsApi()).data;
  } catch (err) {
    return rejectWithValue({ message: getAxiosErrorMessage(err) });
  }
});

export const fetchTripDetail = createAsyncThunk<
  TripWithPoints,
  string,
  { state: RootState; rejectValue: RejectValue }
>(
  "trips/fetchTripDetail",
  async (id, { rejectWithValue }) => {
    try {
      return (await getTripByIdApi(id)).data;
    } catch (err) {
      return rejectWithValue({ message: getAxiosErrorMessage(err) });
    }
  },
  // already cached: skip the network call
  { condition: (id, { getState }) => !getState().trips.details[id] },
);

export const uploadTrip = createAsyncThunk<
  UploadTripResp,
  UploadTripReq,
  { rejectValue: RejectValue }
>("trips/uploadTrip", async (data, { rejectWithValue }) => {
  try {
    return (await uploadTripApi(data)).data;
  } catch (err) {
    return rejectWithValue({ message: getAxiosErrorMessage(err) });
  }
});

export const removeTrip = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectValue }
>("trips/removeTrip", async (id, { rejectWithValue }) => {
  try {
    await deleteTripApi(id);
    return id;
  } catch (err) {
    return rejectWithValue({ message: getAxiosErrorMessage(err) });
  }
});

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    toggleSelectTrip: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
        if (state.activeTripId === id)
          state.activeTripId = state.selectedIds[0] ?? null;
      } else {
        state.selectedIds.push(id);
        if (!state.activeTripId) state.activeTripId = id;
      }
    },
    setActiveTrip: (state, action: PayloadAction<string | null>) => {
      state.activeTripId = action.payload;
    },
    clearTripError: (state) => {
      state.error = null;
    },
    resetTrips: () => initialState, // call on logout
    setSelectedTrips: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
      if (!state.activeTripId || !action.payload.includes(state.activeTripId)) {
        state.activeTripId = action.payload[0] ?? null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to load trips";
      })
      .addCase(fetchTripDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTripDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.details[action.payload.trip._id] = action.payload;
      })
      .addCase(fetchTripDetail.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) state.error = action.payload.message;
      })
      .addCase(uploadTrip.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadTrip.fulfilled, (state, action) => {
        state.uploading = false;
        state.trips.unshift(action.payload.trip);
      })
      .addCase(uploadTrip.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload?.message ?? "Upload failed";
      })
      .addCase(removeTrip.fulfilled, (state, action) => {
        const id = action.payload;
        state.trips = state.trips.filter((t) => t._id !== id);
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
        delete state.details[id];
        if (state.activeTripId === id)
          state.activeTripId = state.selectedIds[0] ?? null;
      })
      .addCase(removeTrip.rejected, (state, action) => {
        state.error = action.payload?.message ?? "Delete failed";
      });
  },
});

export const { toggleSelectTrip, setActiveTrip, clearTripError, resetTrips, setSelectedTrips } =
  tripSlice.actions;
  
export default tripSlice.reducer;
