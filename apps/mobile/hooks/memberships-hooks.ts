import { MembershipService } from "@/service/membership-service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useMembershipsSuspenseQuery() {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["memberships"],
    queryFn: () => MembershipService(token).getMemberships(),
  });
}
