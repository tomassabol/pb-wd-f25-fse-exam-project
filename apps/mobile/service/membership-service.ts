import axios, { type AxiosRequestConfig } from "axios";
import { type Membership } from "../../api/db/schema/membership.schema";

export const MembershipService = {
  getMemberships: async () => {
    const { data } = await axios.get<Membership[]>(
      "/v1/memberships",
      getAxiosConfig()
    );
    return data;
  },
} as const;

const getAxiosConfig = (): AxiosRequestConfig => {
  return {
    baseURL: "http://127.0.0.1:3000",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
    },
  };
};
