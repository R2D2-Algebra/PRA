import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import hr from "./hr.json";
import de from "./de.json";

const LS_KEY = "i18n:lang";
const fallbackLng = "en";
const saved = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;

const detectBrowser = () => {
  if (saved) return saved;
  if (typeof navigator !== "undefined" && navigator.language) {
    const base = navigator.language.split("-")[0];
    return ["en", "hr", "de"].includes(base) ? base : fallbackLng;
  }
  return fallbackLng;
};

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, hr: { translation: hr }, de: { translation: de } },
    lng: detectBrowser(),
    fallbackLng,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language || fallbackLng;
}
i18n.on("languageChanged", (lng) => {
  try { localStorage.setItem(LS_KEY, lng); } catch {}
  if (typeof document !== "undefined") document.documentElement.lang = lng;
});

export default i18n;
