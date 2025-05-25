import { type AxiosRequestConfig } from "axios";

export const getAxiosConfig = ({
  params,
}: Partial<{
  params: Record<string, unknown>;
}> = {}): AxiosRequestConfig => {
  return {
    baseURL: "http://127.0.0.1:3000",
    params,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
    },
  };
};
