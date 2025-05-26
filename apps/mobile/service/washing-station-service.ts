import axios from "axios";
import { getAxiosConfig } from "./util/axios-config";
import { type WashingStation } from "../../api/db/schema/washing-station.schema";

export const WashingStationService = (token: string | null) => ({
  getWashingStations: async (
    params: Partial<{
      isOpen: boolean;
      isPremium: boolean;
      type: string;
      limit: number;
      favorite: boolean;
    }>
  ) => {
    const { data } = await axios.get<
      WashingStation & { isFavorite: boolean }[]
    >("/v1/washing-stations", getAxiosConfig({ params, token }));
    return data;
  },

  getWashingStationById: async (id: string) => {
    const { data } = await axios.get<WashingStation & { isFavorite: boolean }>(
      `/v1/washing-stations/${id}`,
      getAxiosConfig({ token })
    );
    return data;
  },

  getUserFavoriteWashingStations: async () => {
    const { data } = await axios.get<
      (WashingStation & { isFavorite: boolean })[]
    >("/v1/washing-stations/favorite", getAxiosConfig({ token }));
    return data;
  },

  addWashingStationToFavorites: async (id: string) => {
    const { data } = await axios.post<WashingStation>(
      `/v1/washing-stations/${id}/favorite`,
      null,
      getAxiosConfig({ token })
    );
    return data;
  },

  removeWashingStationFromFavorites: async (id: string) => {
    const { data } = await axios.delete<{ message: string }>(
      `/v1/washing-stations/${id}/favorite`,
      getAxiosConfig({ token })
    );
    return data;
  },
});
