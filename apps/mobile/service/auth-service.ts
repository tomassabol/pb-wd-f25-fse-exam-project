import axios from "axios";
import { getAxiosConfig } from "./util/axios-config";
import { User } from "../../api/db/schema/user.schema";

export const AuthService = (token: string | null) => ({
  signIn: async ({ email, password }: { email: string; password: string }) => {
    const { data } = await axios.post<{
      message: string;
      token: string;
      user: Exclude<User, "password">;
    }>(
      "/v1/auth/login",
      {
        email,
        password,
      },
      getAxiosConfig({ token: null })
    );
    return data;
  },

  signUp: async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    const { data } = await axios.post<{
      message: string;
      user: Exclude<User, "password">;
    }>(
      "/v1/auth/register",
      {
        email,
        password,
        fullName,
      },
      getAxiosConfig({ token: null })
    );
    return data;
  },

  getUser: async () => {
    const { data } = await axios.get<{
      user: Exclude<User, "password">;
    }>("/v1/auth/me", getAxiosConfig({ token }));
    return data;
  },
});
