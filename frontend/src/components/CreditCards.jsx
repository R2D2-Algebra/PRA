import React, { useEffect, useMemo, useState } from "react";

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
  }
}

/* dummy */
async function fetchCardsMock() {
  // shape: [{ id, label, brand, last4, name, number, expMonth, expYear }]
  return [
    {
      id: "cc1",
      label: "Personal",
      brand: "visa",
      last4: "4242",
      name: "John Doe",
      number: "4242424242424242",
      expMonth: "12",
      expYear: "2026",
    },
    {
      id: "cc2",
      label: "Work",
      brand: "mastercard",
      last4: "4444",
      name: "John Doe",
      number: "5555555555554444",
      expMonth: "09",
      expYear: "2027",
    },
  ];
}
/** ------------------------------------------------ */

const brandIcon = (brand) => {
  const common = {
    width: 28,
    height: 18,
    borderRadius: 3,
    display: "inline-block",
  };
  switch ((brand || "").toLowerCase()) {
    case "visa":
      return <span style={{ ...common, background: "#1a1f71" }} />;
    case "mastercard":
      return (
        <span style={{ ...common, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 2,
              top: 2,
              width: 12,
              height: 12,
              background: "#eb001b",
              borderRadius: "50%",
              opacity: 0.9,
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 2,
              top: 2,
              width: 12,
              height: 12,
              background: "#f79e1b",
              borderRadius: "50%",
              opacity: 0.9,
            }}
          />
        </span>
      );
    default:
      return <span style={{ ...common, background: "#6b7280" }} />;
  }
};

export default function CreditCards() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchCardsMock();
      setCards(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.last4.includes(q)
    );
  }, [cards, query]);

  return (
    <section style={{ width: "100%", maxWidth: 920 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 700 }}>Credit cards</h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <input
            type="search"
            placeholder="Search card, brand or last 4…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search credit cards"
            style={{
              height: 40,
              minWidth: 260,
              padding: "0 12px",
              borderRadius: 8,
              border: `1px solid var(--border)`,
              background: "var(--surface)",
              color: "var(--text)",
            }}
          />
          <button
            type="button"
            className="gen-btn"
            onClick={() => alert("Add new card (hook up later)")}
          >
            Add
          </button>
        </div>
      </div>

      <div
        style={{
          background: "var(--surface-2)",
          border: `1px solid var(--border)`,
          boxShadow: "var(--shadow)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <ListSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <div style={{ padding: 20, color: "var(--muted)" }}>
            No cards found for this search.
          </div>
        ) : (
          filtered.map((card) => (
            <div key={card.id} style={{ borderTop: `1px solid var(--border)` }}>
              <button
                type="button"
                onClick={() => setOpenId((id) => (id === card.id ? null : card.id))}
                aria-expanded={openId === card.id}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "46px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "transparent",
                  border: "0",
                  cursor: "pointer",
                }}
              >
                <span style={{ marginInline: 8 }}>{brandIcon(card.brand)}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600 }}>
                    {card.label} •••• {card.last4}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
                    {card.brand.toUpperCase()}
                  </div>
                </div>
                <span
                  aria-hidden
                  style={{
                    opacity: 0.6,
                    transform: openId === card.id ? "rotate(90deg)" : "none",
                    transition: "transform .15s",
                    fontWeight: 700,
                  }}
                >
                  ▸
                </span>
              </button>

              {openId === card.id && (
                <div
                  style={{
                    padding: "10px 16px 16px 66px",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <Field label="Name on card" value={card.name} />
                  <Field label="Number" value={`•••• •••• •••• ${card.last4}`} />
                  <Field
                    label="Expiry"
                    value={`${card.expMonth}/${card.expYear}`}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button
                      type="button"
                      className="gen-btn"
                      onClick={() => copy(card.number)}
                      title="Copy full number"
                    >
                      Copy number
                    </button>
                    <button
                      type="button"
                      className="gen-btn"
                      onClick={() => copy(`${card.expMonth}/${card.expYear}`)}
                      title="Copy expiry"
                    >
                      Copy expiry
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div
      style={{
        border: `1px solid var(--border)`,
        borderRadius: 10,
        padding: 12,
        background: "var(--surface)",
        display: "grid",
        gap: 4,
      }}
    >
      <div style={{ color: "var(--muted)", fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function ListSkeleton({ rows = 4 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: "14px 16px",
            display: "grid",
            gridTemplateColumns: "46px 1fr",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 28,
              height: 18,
              borderRadius: 3,
              background:
                "linear-gradient(90deg, rgba(0,0,0,.06), rgba(0,0,0,.12), rgba(0,0,0,.06))",
              animation: "pulse 1.2s infinite",
            }}
          />
          <div
            style={{
              height: 12,
              width: "40%",
              borderRadius: 6,
              background:
                "linear-gradient(90deg, rgba(0,0,0,.06), rgba(0,0,0,.12), rgba(0,0,0,.06))",
              animation: "pulse 1.2s infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
}
