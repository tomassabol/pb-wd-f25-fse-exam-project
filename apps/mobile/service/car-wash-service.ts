import axios from "axios";
import { getAxiosConfig } from "./util/axios-config";
import { type CarWash } from "../../api/db/schema/wash.schema";
import { type CreateCarWashRequest } from "../../api/src/routes/lib/car-wash.schemas";
import { type WashHistory } from "@/types/wash";
import {
  transformCarWashesToHistory,
  transformCarWashToHistory,
  type CarWashWithRelations,
} from "@/utils/carWashTransform";

export const CarWashService = (token: string | null) => ({
  getWashHistory: async (): Promise<WashHistory[]> => {
    const { data } = await axios.get<CarWashWithRelations[]>(
      "/v1/car-wash",
      getAxiosConfig({ token })
    );
    return transformCarWashesToHistory(data);
  },

  getWashById: async (id: string): Promise<WashHistory> => {
    const { data } = await axios.get<CarWashWithRelations>(
      `/v1/car-wash/${id}`,
      getAxiosConfig({ token })
    );
    return transformCarWashToHistory(data);
  },

  startWash: async (body: CreateCarWashRequest) => {
    const { data } = await axios.post<CarWash>(
      "/v1/car-wash",
      body,
      getAxiosConfig({ token })
    );
    return data;
  },
});
