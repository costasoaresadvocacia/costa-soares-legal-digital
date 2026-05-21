import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { clearToken, getToken, login as apiLogin, logout as apiLogout } from "@/lib/adminApi";

interface AuthCtx {
  authenticated: boolean;
  loading: boolean;
  login: (u: string, p: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(!!getToken());
    setLoading(false);
  }, []);

  const login = async (u: string, p: string) => {
    const r = await apiLogin(u, p);
    if (r.ok) setAuthenticated(true);
    return { ok: r.ok, message: r.message };
  };

  const logout = async () => {
    await apiLogout();
    clearToken();
    setAuthenticated(false);
  };

  return (
    <Ctx.Provider value={{ authenticated, loading, login, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
