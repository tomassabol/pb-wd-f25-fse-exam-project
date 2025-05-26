import { createContext, useState, useCallback } from "react";
import { User } from "../../api/db/schema/user.schema";
import { useSignIn, useSignUp } from "@/hooks/auth-hooks";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { mutateAsync: signInFn, isPending: isPendingSignIn } = useSignIn();
  const { mutateAsync: signUpFn, isPending: isPendingSignUp } = useSignUp();
  const [user, setUser] = useState<Exclude<User, "password"> | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const { user, token } = await signInFn({ email, password });
        setUser(user);
        setToken(token);
        console.log("signIn", user, token);
      } catch (error) {
        console.error(error);
        setUser(null);
        setToken(null);
        throw error;
      }
    },
    [signInFn, setUser, setToken]
  );

  const signUp = useCallback(
    async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      try {
        const { user } = await signUpFn({ fullName, email, password });
        const { token } = await signInFn({ email, password });
        setUser(user);
        setToken(token);
      } catch (error) {
        console.error(error);
        setUser(null);
        setToken(null);
        throw error;
      }
    },
    [signUpFn, setUser, setToken]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: isPendingSignIn || isPendingSignUp,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
