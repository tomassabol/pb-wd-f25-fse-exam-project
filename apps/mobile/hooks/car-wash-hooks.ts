import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CarWashService } from "../service/car-wash-service";
import { useAuth } from "./useAuth";
import { type CreateCarWashRequest } from "../../api/src/routes/lib/car-wash.schemas";

export function useCarWashHistorySuspenseQuery() {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["car-wash-history", token],
    queryFn: () => CarWashService(token).getWashHistory(),
  });
}

export function useStartWashMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCarWashRequest) =>
      CarWashService(token).startWash(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-wash-history", token] });
    },
  });
}

export function useCarWashByIdSuspenseQuery(id: string) {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["car-wash-by-id", id, token],
    queryFn: () => CarWashService(token).getWashById(id),
  });
}
