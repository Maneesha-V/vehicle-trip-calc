import axios from "axios";

export const getAxiosErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
};