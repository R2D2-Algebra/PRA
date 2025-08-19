import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const ThemeProvider = ({ children }) => {
  // If there's a session override, use it; otherwise start from system
  const initialOverride = sessionStorage.getItem("themeOverride"); // "light" | "dark" | null
  const [theme, setTheme] = useState(initialOverride || getSystemTheme());
  const [followSystem, setFollowSystem] = useState(!initialOverride); // true when no override

  // Apply to <html data-theme="">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Follow system when followSystem = true
  useEffect(() => {
    if (!followSystem) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => setTheme(getSystemTheme());

    // set now (in case system changed between renders)
    setTheme(getSystemTheme());

    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, [followSystem]);

  const toggleTheme = () => {
    setFollowSystem(false);
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      sessionStorage.setItem("themeOverride", next);
      return next;
    });
  };

  const followSystemNow = () => {
    sessionStorage.removeItem("themeOverride");
    setFollowSystem(true);
    setTheme(getSystemTheme());
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, followSystem, followSystemNow }),
    [theme, followSystem]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
};
