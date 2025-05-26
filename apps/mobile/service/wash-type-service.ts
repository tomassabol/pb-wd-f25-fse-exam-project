import axios from "axios";
import { getAxiosConfig } from "./util/axios-config";
import { type WashType as DBWashType } from "../../api/db/schema/wash-type.schema";
import { type WashType } from "@/types/wash";
import { transformWashTypes } from "@/utils/washTypeUtils";

export const WashTypeService = (token: string | null) => ({
  getWashTypes: async (): Promise<WashType[]> => {
    const { data } = await axios.get<DBWashType[]>(
      "/v1/wash-types",
      getAxiosConfig({ token })
    );
    return transformWashTypes(data);
  },
});
