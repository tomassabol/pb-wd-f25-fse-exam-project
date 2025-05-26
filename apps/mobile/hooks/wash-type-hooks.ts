import { WashTypeService } from "@/service/wash-type-service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useWashTypesSuspense() {
  const { token } = useAuth();

  return useSuspenseQuery({
    queryKey: ["wash-types"],
    queryFn: WashTypeService(token).getWashTypes,
  });
}
