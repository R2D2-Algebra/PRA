import React, { useMemo, useState } from "react";

const EyeIcon = ({ hidden }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {hidden ? (
      <>
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10.58 10.58A4 4 0 0012 16a4 4 0 003.42-5.42M21 12s-3.6 6-9 6c-1.2 0-2.31-.23-3.33-.64M6.16 14.12C4.33 12.92 3 11 3 11s3.6-6 9-6c1.06 0 2.07.17 3 .48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      </>
    )}
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const Favicon = ({ domain }) => {
  const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  return <img className="favicon" src={src} alt="" loading="lazy" />;
};

// dummy
const MOCK_ITEMS = [
  { id: 1, domain: "google.com", username: "jane.doe@gmail.com", password: "g00gle*Pw!" },
  { id: 2, domain: "amazon.com", username: "jane.shop", password: "AmaZon#1234" },
  { id: 3, domain: "github.com", username: "jane-dev", password: "Gh!token-xyz" },
  { id: 4, domain: "notion.so", username: "jane", password: "n0t1on-secure" },
];

export default function PasswordsList() {
  const [query, setQuery] = useState("");
  const [items] = useState(MOCK_ITEMS);
  const [revealed, setRevealed] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.domain.toLowerCase().includes(q) ||
        i.username.toLowerCase().includes(q)
    );
  }, [items, query]);

  const toggleReveal = (id) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyPassword = async (id, password) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedId(id);
      setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <section className="passwords-list" style={{ width: "100%", maxWidth: 820 }}>
      <div className="list-header" style={{ width: "100%", marginBottom: "12px" }}>
        <input
          className="search-input"
          type="search"
          placeholder="Search sites or usernames…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search passwords"
          style={{
            width: "100%",
            height: 44,
            borderRadius: 10,
            border: `1px solid var(--border)`,
            background: "var(--surface)",
            color: "var(--text)",
            padding: "0 12px",
          }}
        />
      </div>

      <ul className="list" style={{ listStyle: "none", margin: 0, padding: 0, width: "100%" }}>
        {filtered.map((item) => {
          const isShown = revealed.has(item.id);
          return (
            <li
              key={item.id}
              className="password-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                borderBottom: `1px solid var(--border)`,
              }}
            >
              <div className="item-left" style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <Favicon domain={item.domain} />
                <div className="meta" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span className="domain" style={{ fontWeight: 600, color: "var(--text)" }}>
                    {item.domain}
                  </span>
                  <span
                    className="username"
                    style={{ color: "var(--muted)", fontSize: ".92rem" }}
                  >
                    {item.username}
                  </span>
                  <span
                    className="password"
                    style={{ color: "var(--muted)", fontSize: ".92rem", letterSpacing: 1 }}
                  >
                    {isShown ? item.password : "• • • • • • • •"}
                  </span>
                </div>
              </div>

              <div className="item-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className="btn-action icon-btn"
                  onClick={() => toggleReveal(item.id)}
                  title={isShown ? "Hide password" : "Show password"}
                  aria-label={isShown ? "Hide password" : "Show password"}
                  style={iconBtnStyle}
                >
                  <EyeIcon hidden={isShown} />
                </button>

                <button
                  className="btn-action icon-btn"
                  onClick={() => copyPassword(item.id, item.password)}
                  title="Copy password"
                  aria-label="Copy password"
                  style={iconBtnStyle}
                >
                  <CopyIcon />
                </button>

                {copiedId === item.id && (
                  <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>Copied!</span>
                )}
              </div>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li style={{ padding: "16px 8px", color: "var(--muted)" }}>No results.</li>
        )}
      </ul>
    </section>
  );
}

const iconBtnStyle = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background .2s, border-color .2s",
};
