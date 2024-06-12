import { createContext } from "react";

import User from "@interfaces/User";

interface AuthContext {
  dataIsLoading: boolean;
  user: User | undefined;
  token: string | undefined;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContext>({
  dataIsLoading: false,
  user: undefined,
  token: undefined,
  login: () => {},
  logout: () => {},
});

export default AuthContext;
