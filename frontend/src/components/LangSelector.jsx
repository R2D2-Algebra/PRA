import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LangSelector = () => {
  const { i18n } = useTranslation();

  const change = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem("i18n:lang", lang);
    } catch {}
    const rtl = ["ar", "he", "fa", "ur"];
    document.documentElement.dir = rtl.includes(lang) ? "rtl" : "ltr";
  };

  useEffect(() => {
    const saved = localStorage.getItem("i18n:lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  return (
    <select
      className="btn-action"
      aria-label="Language"
      value={i18n.language}
      onChange={change}
    >
      <option value="en">EN</option>
      <option value="hr">HR</option>
      <option value="de">DE</option>
    </select>
  );
};

export default LangSelector;
