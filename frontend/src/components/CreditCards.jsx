import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../api/creditCard.js";
import { useTranslation } from "react-i18next";

const normalize = (c) => ({
  id: c.id ?? c.Id,
  cardNumber: c.cardNumber ?? c.CardNumber ?? "",
  expiry: c.expiry ?? c.Expiry ?? "",
  cvv: c.cvv ?? c.Cvv ?? "",
});

const mask = (num = "", show = false) =>
  show ? formatNumber(num) : "•••• •••• •••• " + (num ? String(num).slice(-4) : "••••");

function formatNumber(n = "") {
  const digits = String(n).replace(/\s+/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

const isValidExpiry = (val) => /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(val);
const isValidCvv = (val) => /^\d{3,4}$/.test(val);

const MOCK = [
  { id: 1, cardNumber: "4111111111111111", expiry: "12/27", cvv: "123" },
  { id: 2, cardNumber: "5555555555554444", expiry: "08/26", cvv: "987" },
];

const Modal = ({ title, children, onClose }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
  >
    <div className="login-modal" style={{ maxWidth: 460 }}>
      <button className="close-btn" onClick={onClose}>×</button>
      <h2 className="login-title" style={{ marginBottom: "1rem" }}>{title}</h2>
      {children}
    </div>
  </div>
);

export default function CreditCards() {
  const { t } = useTranslation();
  const { user, token, useFakeAuth } = useAuth();

  const [cards, setCards] = useState(MOCK);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [showing, setShowing] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "" });
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
        if (!alive) return;
        setCards(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Cards load failed:", e.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [user, token, useFakeAuth]);

  const filtered = useMemo(() => {
    if (!query) return cards;
    const q = query.toLowerCase().replace(/\s+/g, "");
    return cards.filter((c) => {
      const num = String(c.cardNumber || "");
      return num.toLowerCase().includes(q) || num.slice(-4).toLowerCase().includes(q);
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
    try { await navigator.clipboard.writeText(text); } catch {}
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
    if (!/^\d{12,19}$/.test(num)) return t("cards.error_number");
    if (!isValidExpiry(form.expiry)) return t("cards.error_expiry");
    if (!isValidCvv(form.cvv)) return t("cards.error_cvv");
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
              ? { ...c, cardNumber: payload.CardNumber, expiry: payload.Expiry, cvv: payload.Cvv }
              : c
          )
        );
      } else {
        const nextId = Math.max(0, ...cards.map((c) => c.id)) + 1;
        setCards((prev) => [
          { id: nextId, cardNumber: payload.CardNumber, expiry: payload.Expiry, cvv: payload.Cvv },
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
              ? { ...c, cardNumber: payload.CardNumber, expiry: payload.Expiry, cvv: payload.Cvv }
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
      setError(e.message || t("cards.error_save"));
    }
  };

  const handleDelete = async (id) => {
    const item = cards.find((c) => c.id === id);
    if (!item) return;
    const last4 = String(item.cardNumber).slice(-4);
    if (!confirm(t("cards.confirm_delete", { last4 }))) return;

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
        <h2>{t("cards.title")}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="cc-search"
            placeholder={t("cards.search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-action" onClick={openAdd} aria-label={t("common.add")}>
            + {t("common.add")}
          </button>
        </div>
      </div>

      {loading && <div className="text-muted mb-2">{t("common.loading")}</div>}

      <ul className="cc-items">
        {filtered.map((card) => {
          const isShown = showing.has(card.id);
          const last4 = String(card.cardNumber || "").slice(-4);

          return (
            <li key={card.id} className="cc-card">
              <div className="cc-meta">
                <div className="cc-title">
                  <span className="cc-brand">{t("cards.card_label")}</span>
                  <span className="cc-last4">{mask(card.cardNumber, isShown)}</span>
                </div>
                <div className="cc-sub">
                  <span>{t("cards.expiry")}: {card.expiry || "—"}</span>
                  <span>{t("cards.cvv")}: {isShown ? card.cvv : "•••"}</span>
                  <span>{t("cards.last4")}: {last4 || "—"}</span>
                </div>
              </div>

              <div className="cc-actions">
                <button
                  className="btn-action"
                  onClick={() => copy(String(card.cardNumber || ""))}
                >
                  {t("cards.copy_number")}
                </button>
                <button className="btn-action" onClick={() => toggleShow(card.id)}>
                  {isShown ? t("cards.hide") : t("cards.show")}
                </button>
                <button className="btn-action" onClick={() => openEdit(card)}>
                  {t("common.edit")}
                </button>
                <button className="btn-action" onClick={() => handleDelete(card.id)}>
                  {t("common.delete")}
                </button>
              </div>
            </li>
          );
        })}

        {!filtered.length && !loading && (
          <li className="text-muted p-3">{t("cards.no_cards")}</li>
        )}
      </ul>

      {isModalOpen && (
        <Modal title={editing ? t("cards.modal_edit") : t("cards.modal_add")} onClose={closeModal}>
          {error && (
            <div className="alert alert-danger" role="alert" style={{ marginBottom: "0.75rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="login-form">
            <div className="form-group">
              <label htmlFor="cc-number">{t("cards.card_number")}</label>
              <input
                id="cc-number"
                type="text"
                inputMode="numeric"
                value={form.cardNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cardNumber: e.target.value.replace(/[^\d\s]/g, "") }))
                }
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cc-expiry">{t("cards.expiry")}</label>
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
              <label htmlFor="cc-cvv">{t("cards.cvv")}</label>
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
                {t("common.cancel")}
              </button>
              <button type="submit" className="btn-action">
                {editing ? t("common.save") : t("common.add")}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
