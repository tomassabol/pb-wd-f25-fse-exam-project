import axios from "axios";
import { type Membership } from "../../api/db/schema/membership.schema";
import { getAxiosConfig } from "./util/axios-config";

export const MembershipService = (token: string | null) => ({
  getMemberships: async () => {
    const { data } = await axios.get<Membership[]>(
      "/v1/memberships",
      getAxiosConfig({ token })
    );
    return data;
  },
});
