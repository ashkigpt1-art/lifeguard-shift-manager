import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest, logout as logoutRequest, fetchCurrentUser } from "../api";
import { User } from "../api/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  bootstrap: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(fetchCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { user: loggedInUser } = await loginRequest(email, password);
        setUser(loggedInUser);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const bootstrap = useCallback(() => {
    const stored = fetchCurrentUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, bootstrap }),
    [user, loading, login, logout, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
