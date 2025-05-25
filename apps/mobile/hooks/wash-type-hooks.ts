import { WashTypeService } from "@/service/wash-type-service";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function useWashTypesSuspense() {
  return useSuspenseQuery({
    queryKey: ["wash-types"],
    queryFn: WashTypeService.getWashTypes,
  });
}
