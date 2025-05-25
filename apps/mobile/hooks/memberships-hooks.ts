import { MembershipService } from "@/service/membership-service";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useMembershipsSuspenseQuery() {
  return useSuspenseQuery({
    queryKey: ["memberships"],
    queryFn: () => MembershipService.getMemberships(),
  });
}
