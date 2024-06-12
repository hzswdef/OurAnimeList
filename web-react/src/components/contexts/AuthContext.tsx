import { ReactNode, useEffect, useState } from "react";

import AuthContext from "@contexts/AuthContext";
import BackendApi from "@api/BackendApi";
import User from "@interfaces/User";
import { toast } from "react-toastify";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem("token") || undefined,
  );
  const [user, setUser] = useState<User | undefined>(undefined);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(() => {
    return !!token;
  });

  useEffect(() => {
    if (token) {
      new BackendApi()
        .getCurrentUser()
        .then((response) => {
          setUser(response.data);
          setDataIsLoading(false);
        })
        .catch((error) => {
          switch (error.code) {
            case 401:
              setToken(undefined);
              break;
            case "ERR_NETWORK":
              toast.error("Backend unavailable...");
              break;
          }
          setDataIsLoading(false);
        });
    }
  }, [token, setToken]);

  const login = (accessToken: string) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    if (token) {
      localStorage.removeItem("token");
      setToken(undefined);
    }
  };

  return (
    <AuthContext.Provider value={{ dataIsLoading, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
