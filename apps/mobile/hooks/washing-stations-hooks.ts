import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { WashingStationService } from "../service/washing-station-service";
import { useAuth } from "./useAuth";

export function useWashingStationsSuspenseQuery({
  isOpen,
  isPremium,
  type,
  limit,
  favorite,
}: Partial<{
  isOpen: boolean;
  isPremium: boolean;
  type: string;
  limit: number;
  favorite: boolean;
}> = {}) {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["washing-stations", isOpen, isPremium, type, limit, favorite],
    queryFn: () =>
      WashingStationService(token).getWashingStations({
        isOpen,
        isPremium,
        type,
        limit,
        favorite,
      }),
  });
}

export function useWashingStationByIdSuspenseQuery(id: string) {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["washing-stations", id],
    queryFn: () => WashingStationService(token).getWashingStationById(id),
  });
}

export function useUserFavoriteWashingStationsSuspenseQuery() {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["user-favorite-washing-stations", token],
    queryFn: () =>
      WashingStationService(token).getUserFavoriteWashingStations(),
  });
}

export function useAddWashingStationToFavoritesMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      WashingStationService(token).addWashingStationToFavorites(id),
    onSuccess(_, id) {
      queryClient.invalidateQueries({
        queryKey: ["user-favorite-washing-stations", token],
      });
      queryClient.invalidateQueries({
        queryKey: ["washing-stations", id],
      });
    },
  });
}

export function useRemoveWashingStationFromFavoritesMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      WashingStationService(token).removeWashingStationFromFavorites(id),
    onSuccess(_, id) {
      queryClient.invalidateQueries({
        queryKey: ["user-favorite-washing-stations", token],
      });
      queryClient.invalidateQueries({
        queryKey: [id],
      });
      queryClient.invalidateQueries({
        queryKey: ["washing-stations"],
      });
    },
  });
}
