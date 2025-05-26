import axios from "axios";
import { type Membership } from "../../api/db/schema/membership.schema";
import { getAxiosConfig } from "./util/axios-config";
import { type UserMembership } from "../../api/db/schema/user-membership.schema";

export const MembershipService = (token: string | null) => ({
  getMemberships: async () => {
    const { data } = await axios.get<Membership[]>(
      "/v1/memberships",
      getAxiosConfig({ token })
    );
    return data;
  },

  getUserMemberships: async () => {
    const { data } = await axios.get<
      (UserMembership & { membership: Membership })[]
    >("/v1/user-memberships", getAxiosConfig({ token }));
    return data;
  },

  createMembership: async ({
    membershipId,
    licensePlate,
  }: {
    membershipId: string;
    licensePlate: string;
  }) => {
    const { data } = await axios.post(
      `/v1/user-memberships/${membershipId}`,
      { licensePlate },
      getAxiosConfig({ token })
    );
    return data;
  },

  cancelMembership: async (userMembershipId: string) => {
    const { data } = await axios.delete(
      `/v1/user-memberships/${userMembershipId}`,
      getAxiosConfig({ token })
    );
    return data;
  },
});
