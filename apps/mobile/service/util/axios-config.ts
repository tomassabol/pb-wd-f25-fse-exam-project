import { type AxiosRequestConfig } from "axios";

export const getAxiosConfig = ({
  params,
  token,
}: Partial<{
  params: Record<string, unknown>;
  token: string | null;
}>): AxiosRequestConfig => {
  return {
    baseURL: "http://127.0.0.1:3000",
    params,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
      Authorization: `Bearer ${token}`,
    },
  };
};
