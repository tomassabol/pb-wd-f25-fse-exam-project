import { MembershipService } from "@/service/membership-service";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useMembershipsSuspenseQuery() {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["memberships"],
    queryFn: () => MembershipService(token).getMemberships(),
  });
}

export function useUserMembershipsSuspenseQuery() {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["user-memberships", token],
    queryFn: () => MembershipService(token).getUserMemberships(),
  });
}

export function useCreateMembershipMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      membershipId,
      licensePlate,
    }: {
      membershipId: string;
      licensePlate: string;
    }) =>
      MembershipService(token).createMembership({ membershipId, licensePlate }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-memberships", token] });
    },
  });
}

export function useCancelMembershipMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userMembershipId: string) =>
      MembershipService(token).cancelMembership(userMembershipId),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-memberships", token] });
    },
  });
}
