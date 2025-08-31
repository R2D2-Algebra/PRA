import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", short: "EN", label: "English" },
  { code: "hr", short: "HR", label: "Hrvatski" },
  { code: "de", short: "DE", label: "Deutsch" },
];

export default function LangSelector({ fullWidth = true }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    LANGS.find(l => l.code === (i18n.language || "en").slice(0,2)) || LANGS[0];

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const change = async (code) => {
    await i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="lang-dd" ref={ref} style={{ width: fullWidth ? "100%" : "auto" }}>
      <button
        type="button"
        className="btn btn-outline-primary lang-dd-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {t("common.language", "Language")}: {current.short}
      </button>

      {open && (
        <div className="lang-dd-menu" role="menu">
          {LANGS.map(l => (
            <button
              key={l.code}
              type="button"
              className="lang-dd-item"
              onClick={() => change(l.code)}
              aria-current={current.code === l.code ? "true" : "false"}
            >
              <span style={{ marginRight: 8, opacity: .8 }}>{l.short}</span>
              {l.label}
              {current.code === l.code && <span style={{ marginLeft: "auto" }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
