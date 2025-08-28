import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth:token";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || null);
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  }, [token]);


  useEffect(() => {
    if (!token) { setUser(null); return; }
    setLoading(true);

    // dummy user
    setUser({
      id: 1,
      email: "test@test.com",
      name: "12345",
    });

    setLoading(false);

    /* reel cod
    let alive = true;
    const run = async () => {
      if (!token) { setUser(null); return; }
      try {
        setLoading(true);
        const res = await fetch("/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!alive) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        console.warn("auth hydrate failed:", e);
        setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => { alive = false; };
    ----------------------------------------------- */
  }, [token]);

  // Fake login
  const login = async (email, password) => {
    const fakeUser = { id: 1, email, name: "Demo User" };
    setToken("FAKE_TOKEN_123");
    setUser(fakeUser);
    return { token: "FAKE_TOKEN_123", user: fakeUser };

    /* reel log
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Login failed");
    const data = await res.json();
    if (data.token) setToken(data.token);
    if (data.user)  setUser(data.user);
    return data;
    ---------------------------------- */
  };

  const register = async () => {
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({
    user, token, loading, login, register, logout
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export default AuthProvider;
