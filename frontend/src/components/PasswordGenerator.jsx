import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const buildPool = (opts) => {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{};:,.<>?";
  let pool = "";
  if (opts.lower) pool += lowers;
  if (opts.upper) pool += uppers;
  if (opts.digits) pool += digits;
  if (opts.symbols) pool += symbols;
  return pool || lowers + uppers + digits;
};

const makePassword = (opts) => {
  const pool = buildPool(opts);
  let out = "";
  for (let i = 0; i < opts.length; i++) {
    out += pool[Math.floor(Math.random() * pool.length)];
  }
  return out;
};

const PasswordGenerator = () => {
  const { t } = useTranslation();
  const [opts, setOpts] = useState({
    length: 16,
    lower: true,
    upper: true,
    digits: true,
    symbols: false,
  });

  const [nonce, setNonce] = useState(0);

  const password = useMemo(() => makePassword(opts), [opts, nonce]);

  const regenerate = () => setNonce((n) => n + 1);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
    } catch {}
  };

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setOpts((o) => ({
      ...o,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  return (
    <div className="gen-card">
      <h2 className="gen-title">{t("generator.title")}</h2>

      <div className="gen-options">
        <label className="gen-field">
          <span>{t("generator.length")}</span>
          <input
            className="gen-number"
            type="number"
            name="length"
            min="6"
            max="64"
            value={opts.length}
            onChange={onChange}
            aria-label={t("generator.length")}
          />
        </label>

        <label className="gen-check">
          <input
            type="checkbox"
            name="lower"
            checked={opts.lower}
            onChange={onChange}
            aria-label={t("generator.lowercase")}
          />
          <span>{t("generator.lowercase")}</span>
        </label>

        <label className="gen-check">
          <input
            type="checkbox"
            name="upper"
            checked={opts.upper}
            onChange={onChange}
            aria-label={t("generator.uppercase")}
          />
          <span>{t("generator.uppercase")}</span>
        </label>

        <label className="gen-check">
          <input
            type="checkbox"
            name="digits"
            checked={opts.digits}
            onChange={onChange}
            aria-label={t("generator.digits")}
          />
          <span>{t("generator.digits")}</span>
        </label>

        <label className="gen-check">
          <input
            type="checkbox"
            name="symbols"
            checked={opts.symbols}
            onChange={onChange}
            aria-label={t("generator.symbols")}
          />
          <span>{t("generator.symbols")}</span>
        </label>
      </div>

      <br />

      <div className="gen-output-row">
        <input
          className="gen-output"
          type="text"
          value={password}
          readOnly
          aria-label={t("generator.title")}
        />
        <button type="button" className="btn gen-btn" onClick={regenerate}>
          {t("generator.new")}
        </button>
        <button type="button" className="btn gen-btn" onClick={copy}>
          {t("generator.copy")}
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
