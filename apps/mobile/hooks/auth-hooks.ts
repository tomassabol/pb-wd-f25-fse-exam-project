import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "../service/auth-service";

export function useSignIn() {
  return useMutation({
    mutationFn: AuthService(null).signIn,
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: AuthService(null).signUp,
  });
}

export function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: AuthService(null).getUser,
  });
}
