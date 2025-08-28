import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const ThemeProvider = ({ children }) => {
  const initialOverride = sessionStorage.getItem("themeOverride");
  const [theme, setTheme] = useState(initialOverride || getSystemTheme());
  const [followSystem, setFollowSystem] = useState(!initialOverride); 

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!followSystem) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => setTheme(getSystemTheme());

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
