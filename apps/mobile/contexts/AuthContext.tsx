import { createContext, useState, useCallback, useEffect } from "react";
import { User } from "../../api/db/schema/user.schema";
import { useSignIn, useSignUp } from "@/hooks/auth-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_USER = "@auth_user";
const STORAGE_KEY_TOKEN = "@auth_token";

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_USER),
          AsyncStorage.getItem(STORAGE_KEY_TOKEN),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading auth from storage:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadStoredAuth();
  }, []);

  const persistAuth = async (
    user: Exclude<User, "password"> | null,
    token: string | null
  ) => {
    try {
      if (user && token) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user)),
          AsyncStorage.setItem(STORAGE_KEY_TOKEN, token),
        ]);
      } else {
        await Promise.all([
          AsyncStorage.removeItem(STORAGE_KEY_USER),
          AsyncStorage.removeItem(STORAGE_KEY_TOKEN),
        ]);
      }
    } catch (error) {
      console.error("Error persisting auth:", error);
    }
  };

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
    await persistAuth(null, null);
  }, []);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const { user, token } = await signInFn({ email, password });
        setUser(user);
        setToken(token);
        await persistAuth(user, token);
        console.log("signIn", user, token);
      } catch (error) {
        console.error(error);
        setUser(null);
        setToken(null);
        await persistAuth(null, null);
        throw error;
      }
    },
    [signInFn]
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
        await persistAuth(user, token);
      } catch (error) {
        console.error(error);
        setUser(null);
        setToken(null);
        await persistAuth(null, null);
        throw error;
      }
    },
    [signUpFn, signInFn]
  );

  if (!isInitialized) {
    return null; // or a loading spinner
  }

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
