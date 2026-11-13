import { axiosPrivate } from "../config/axiosClient";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse, MsgResponse } from "../types/commonTypes";
import type {
  TripDTO,
  TripWithPoints,
  UploadTripReq,
  UploadTripResp,
} from "../types/tripTypes";

export const getTripsApi = async () => {
  const res = await axiosPrivate.get<ApiResponse<TripDTO[]>>(API_ROUTES.TRIPS.BASE);
  return res.data;
};

export const getTripByIdApi = async (id: string) => {
  const res = await axiosPrivate.get<ApiResponse<TripWithPoints>>(API_ROUTES.TRIPS.BY_ID(id));
  return res.data;
};

export const uploadTripApi = async ({ file, name, vehicleId }: UploadTripReq) => {
  const form = new FormData();
  form.append("file", file);
  if (name) form.append("name", name);
  if (vehicleId) form.append("vehicleId", vehicleId);

  const res = await axiosPrivate.post<ApiResponse<UploadTripResp>>(API_ROUTES.TRIPS.UPLOAD, form);
  return res.data;
};

export const deleteTripApi = async (id: string) => {
  const res = await axiosPrivate.delete<MsgResponse>(API_ROUTES.TRIPS.BY_ID(id));
  return res.data;
};