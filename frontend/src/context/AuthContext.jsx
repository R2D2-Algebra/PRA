import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth:token";
const DEFAULT_FAKE =
  (import.meta.env.VITE_FAKE_AUTH || "false").toLowerCase() === "true";

const mockUser = { id: 1, email: "test@example.com", name: "Test User" };

export const AuthProvider = ({ children }) => {
  const useFakeAuth = DEFAULT_FAKE;

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(() => (useFakeAuth ? mockUser : null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  }, [token]);

  useEffect(() => {
    if (useFakeAuth) return;
    if (token && !user) {
      setUser({ email: "authenticated@user", name: "Authenticated User" });
    }
  }, [token, user, useFakeAuth]);

  const login = async (email, password) => {
    if (useFakeAuth) {
      setUser(mockUser);
      setToken(null);
      return { user: mockUser };
    }
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (!data?.token) throw new Error("Invalid credentials.");
      setToken(data.token);
      setUser({ email, name: email.split("@")[0] });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password }) => {
    if (useFakeAuth) return { ok: true };
    return authApi.register({ email, password });
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, useFakeAuth, login, register, logout }),
    [user, token, loading, useFakeAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
