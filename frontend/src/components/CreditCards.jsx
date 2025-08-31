// src/components/CreditCards.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../api/creditCard.js";

/* ---------- helpers ---------- */

// Normalize API responses (camelCase or PascalCase) to a single shape.
const normalize = (c) => ({
  id: c.id ?? c.Id,
  cardNumber: c.cardNumber ?? c.CardNumber ?? "",
  expiry: c.expiry ?? c.Expiry ?? "",
  cvv: c.cvv ?? c.Cvv ?? "",
});

// Mask card number unless shown.
const mask = (num = "", show = false) =>
  show ? formatNumber(num) : "•••• •••• •••• " + (num ? String(num).slice(-4) : "••••");

// Add grouping spaces for readability.
function formatNumber(n = "") {
  const digits = String(n).replace(/\s+/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

// Very basic validation for expiry: MM/YY or MM/YYYY
const isValidExpiry = (val) => /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(val);

// CVV: 3-4 digits
const isValidCvv = (val) => /^\d{3,4}$/.test(val);

/* ---------- local mock (for fake auth) ---------- */
const MOCK = [
  {
    id: 1,
    cardNumber: "4111111111111111",
    expiry: "12/27",
    cvv: "123",
  },
  {
    id: 2,
    cardNumber: "5555555555554444",
    expiry: "08/26",
    cvv: "987",
  },
];

/* ---------- modal shell (reusing login modal styles) ---------- */
const Modal = ({ title, children, onClose }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
  >
    <div className="login-modal" style={{ maxWidth: 460 }}>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
      <h2 className="login-title" style={{ marginBottom: "1rem" }}>
        {title}
      </h2>
      {children}
    </div>
  </div>
);

/* ---------- component ---------- */
export default function CreditCards() {
  const { user, token, useFakeAuth } = useAuth();

  const [cards, setCards] = useState(MOCK);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [showing, setShowing] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (useFakeAuth) {
        setCards(MOCK);
        return;
      }
      try {
        setLoading(true);
        const data = await getCards();
        setCards(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Cards load failed:", e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [user, token, useFakeAuth]);

  const filtered = useMemo(() => {
    if (!query) return cards;
    const q = query.toLowerCase().replace(/\s+/g, "");
    return cards.filter((c) => {
      const num = String(c.cardNumber || "");
      return (
        num.toLowerCase().includes(q) ||
        num.slice(-4).toLowerCase().includes(q)
      );
    });
  }, [cards, query]);

  const toggleShow = (id) => {
    setShowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ cardNumber: "", expiry: "", cvv: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (card) => {
    setEditing(card);
    setForm({
      cardNumber: formatNumber(card.cardNumber || ""),
      expiry: card.expiry || "",
      cvv: card.cvv || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm({ cardNumber: "", expiry: "", cvv: "" });
    setError("");
  };

  const validate = () => {
    const num = form.cardNumber.replace(/\s+/g, "");
    if (!/^\d{12,19}$/.test(num)) return "Card number should be 12–19 digits.";
    if (!isValidExpiry(form.expiry)) return "Expiry must be MM/YY or MM/YYYY.";
    if (!isValidCvv(form.cvv)) return "CVV must be 3–4 digits.";
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    const payload = {
      CardNumber: form.cardNumber.replace(/\s+/g, ""),
      Expiry: form.expiry.trim(),
      Cvv: form.cvv.trim(),
    };

    if (useFakeAuth) {
      if (editing) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  cardNumber: payload.CardNumber,
                  expiry: payload.Expiry,
                  cvv: payload.Cvv,
                }
              : c
          )
        );
      } else {
        const nextId = Math.max(0, ...cards.map((c) => c.id)) + 1;
        setCards((prev) => [
          {
            id: nextId,
            cardNumber: payload.CardNumber,
            expiry: payload.Expiry,
            cvv: payload.Cvv,
          },
          ...prev,
        ]);
      }
      closeModal();
      return;
    }

    try {
      if (editing) {
        await updateCard(editing.id, payload);
        setCards((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  cardNumber: payload.CardNumber,
                  expiry: payload.Expiry,
                  cvv: payload.Cvv,
                }
              : c
          )
        );
      } else {
        const created = await createCard(payload);
        const newCard = normalize(created ?? payload);
        setCards((prev) => [newCard, ...prev]);
      }
      closeModal();
    } catch (e) {
      setError(e.message || "Failed to save.");
    }
  };

  const handleDelete = async (id) => {
    const item = cards.find((c) => c.id === id);
    if (!item) return;
    if (!confirm(`Delete card ending in ${String(item.cardNumber).slice(-4)}?`))
      return;

    if (useFakeAuth) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      return;
    }

    try {
      await deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error("Delete failed:", e.message);
    }
  };

  return (
    <div className="cc-list">
      <div className="cc-header">
        <h2>Credit cards</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="cc-search"
            placeholder="Search by digits / last 4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-action" onClick={openAdd} aria-label="Add card">
            + Add
          </button>
        </div>
      </div>

      {loading && <div className="text-muted mb-2">Loading…</div>}

      <ul className="cc-items">
        {filtered.map((card) => {
          const isShown = showing.has(card.id);
          const last4 = String(card.cardNumber || "").slice(-4);

          return (
            <li key={card.id} className="cc-card">
              <div className="cc-meta">
                <div className="cc-title">
                  <span className="cc-brand">Card</span>
                  <span className="cc-last4">{mask(card.cardNumber, isShown)}</span>
                </div>
                <div className="cc-sub">
                  <span>Expiry: {card.expiry || "—"}</span>
                  <span>CVV: {isShown ? card.cvv : "•••"}</span>
                  <span>Last 4: {last4 || "—"}</span>
                </div>
              </div>

              <div className="cc-actions">
                <button
                  className="btn-action"
                  onClick={() => copy(String(card.cardNumber || ""))}
                  title="Copy full number"
                >
                  Copy number
                </button>
                <button className="btn-action" onClick={() => toggleShow(card.id)}>
                  {isShown ? "Hide" : "Show"}
                </button>
                <button className="btn-action" onClick={() => openEdit(card)}>
                  Edit
                </button>
                <button className="btn-action" onClick={() => handleDelete(card.id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}

        {!filtered.length && !loading && (
          <li className="text-muted p-3">No cards.</li>
        )}
      </ul>

      {isModalOpen && (
        <Modal title={editing ? "Edit card" : "Add card"} onClose={closeModal}>
          {error && (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ marginBottom: "0.75rem" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="login-form">
            <div className="form-group">
              <label htmlFor="cc-number">Card number</label>
              <input
                id="cc-number"
                type="text"
                inputMode="numeric"
                value={form.cardNumber}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    cardNumber: e.target.value.replace(/[^\d\s]/g, ""),
                  }))
                }
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cc-expiry">Expiry (MM/YY)</label>
              <input
                id="cc-expiry"
                type="text"
                inputMode="numeric"
                value={form.expiry}
                onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                placeholder="12/27"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cc-cvv">CVV</label>
              <input
                id="cc-cvv"
                type="text"
                inputMode="numeric"
                value={form.cvv}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "") }))
                }
                placeholder="123"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-2">
              <button type="button" className="btn-action" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn-action">
                {editing ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
