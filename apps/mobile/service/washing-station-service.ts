import axios from "axios";
import { getAxiosConfig } from "./util/axios-config";
import { type WashingStation } from "../../api/db/schema/washing-station.schema";

export const WashingStationService = {
  getWashingStations: async (
    params: Partial<{
      isOpen: boolean;
      isPremium: boolean;
      type: string;
      limit: number;
    }>
  ) => {
    const { data } = await axios.get<WashingStation[]>(
      "/v1/washing-stations",
      getAxiosConfig({ params })
    );
    return data;
  },
  getWashingStationById: async (id: string) => {
    const { data } = await axios.get<WashingStation>(
      `/v1/washing-stations/${id}`,
      getAxiosConfig()
    );
    return data;
  },
} as const;
