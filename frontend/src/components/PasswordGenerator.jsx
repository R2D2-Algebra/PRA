import React, { useMemo, useState } from "react";

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
  const [opts, setOpts] = useState({
    length: 16,
    lower: true,
    upper: true,
    digits: true,
    symbols: false,
  });

  const password = useMemo(() => makePassword(opts), [opts]);

  const regenerate = () => {
    setOpts((o) => ({ ...o, length: Number(o.length) })); 
  };

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
      <h2 className="gen-title">Password Generator</h2>

      <div className="gen-options">
        <label className="gen-field">
          <span>Length</span>
          <input
            className="gen-number"
            type="number"
            name="length"
            min="6"
            max="64"
            value={opts.length}
            onChange={onChange}
          />
        </label>

        <label className="gen-check">
          <input type="checkbox" name="lower" checked={opts.lower} onChange={onChange} />
          <span>Lowercase</span>
        </label>

        <label className="gen-check">
          <input type="checkbox" name="upper" checked={opts.upper} onChange={onChange} />
          <span>Uppercase</span>
        </label>

        <label className="gen-check">
          <input type="checkbox" name="digits" checked={opts.digits} onChange={onChange} />
          <span>Digits</span>
        </label>

        <label className="gen-check">
          <input type="checkbox" name="symbols" checked={opts.symbols} onChange={onChange} />
          <span>Symbols</span>
        </label>
      </div>
      <br />
      <div className="gen-output-row">
        <input className="gen-output" type="text" value={password} readOnly />
        <button type="button" className="btn gen-btn" onClick={regenerate}>New</button>
        <button type="button" className="btn gen-btn" onClick={copy}>Copy</button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
