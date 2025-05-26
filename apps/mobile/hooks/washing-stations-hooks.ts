import { useSuspenseQuery } from "@tanstack/react-query";
import { WashingStationService } from "../service/washing-station-service";
import { useAuth } from "./useAuth";

export function useWashingStationsSuspenseQuery({
  isOpen,
  isPremium,
  type,
  limit,
}: Partial<{
  isOpen: boolean;
  isPremium: boolean;
  type: string;
  limit: number;
}> = {}) {
  const { token } = useAuth();
  return useSuspenseQuery({
    queryKey: ["washing-stations", isOpen, isPremium, type, limit],
    queryFn: () =>
      WashingStationService(token).getWashingStations({
        isOpen,
        isPremium,
        type,
        limit,
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
