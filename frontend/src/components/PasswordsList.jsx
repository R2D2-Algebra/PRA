import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getLogins,
  createLogin,
  updateLogin,
  deleteLogin,
} from "../api/loginEntry.js";
import { useTranslation } from "react-i18next";

const MOCK = [
  { id: 1, domain: "google.com", username: "marko", password: "brr patapim", createdAt: new Date().toISOString() },
  { id: 2, domain: "github.com", username: "darko",   password: "bombardiro crocodilo", createdAt: new Date(Date.now() - 864e5).toISOString() },
];

const mask = (value = "", isShown = false) => (isShown ? value : "••••••••");

const Modal = ({ title, onClose, children, maxWidth = 480 }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
  >
    <div className="login-modal" style={{ maxWidth }}>
      <button className="close-btn" onClick={onClose}>×</button>
      <h2 className="login-title" style={{ marginBottom: "1rem" }}>{title}</h2>
      {children}
    </div>
  </div>
);

const PasswordsList = () => {
  const { t } = useTranslation();
  const { useFakeAuth } = useAuth();

  const [items, setItems] = useState(MOCK);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ domain: "", username: "", password: "" });
  const [formErr, setFormErr] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (useFakeAuth) {
        setItems(MOCK);
        return;
      }
      try {
        setLoading(true);
        const data = await getLogins(query || undefined);
        if (!alive) return;
        const normalized = Array.isArray(data)
          ? data.map((d) => ({
              id: d.id ?? d.Id,
              domain: d.domain ?? d.Domain ?? "",
              username: d.username ?? d.Username ?? "",
              password: d.password ?? d.Password ?? "",
              createdAt: d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
            }))
          : [];
        setItems(normalized);
      } catch (e) {
        console.warn("Passwords load failed:", e.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [useFakeAuth, query]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        (i.domain || "").toLowerCase().includes(q) ||
        (i.username || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const toggleShow = (id) =>
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ domain: "", username: "", password: "" });
    setFormErr("");
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      domain: row.domain || "",
      username: row.username || "",
      password: row.password || "",
    });
    setFormErr("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm({ domain: "", username: "", password: "" });
    setFormErr("");
  };

  const validate = () => {
    if (!form.domain.trim())   return t("passwords.error_domain",   "Domain is required.");
    if (!form.username.trim()) return t("passwords.error_username", "Username is required.");
    if (!form.password.trim()) return t("passwords.error_password", "Password is required.");
    return "";
    };

  const handleSave = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setFormErr(msg);

    const payload = {
      Domain: form.domain.trim(),
      Username: form.username.trim(),
      Password: form.password,
    };

    if (useFakeAuth) {
      if (editing) {
        setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...form } : i)));
      } else {
        const nextId = Math.max(0, ...items.map((i) => +i.id || 0)) + 1;
        setItems((prev) => [
          { id: nextId, ...form, createdAt: new Date().toISOString() },
          ...prev,
        ]);
      }
      closeModal();
      return;
    }

    try {
      if (editing) {
        await updateLogin(editing.id, payload);
        setItems((prev) =>
          prev.map((i) =>
            i.id === editing.id
              ? { ...i, domain: form.domain.trim(), username: form.username.trim(), password: form.password }
              : i
          )
        );
      } else {
        const created = await createLogin(payload);
        const normalized = {
          id: created?.id ?? created?.Id ?? Date.now(),
          domain: created?.domain ?? created?.Domain ?? form.domain.trim(),
          username: created?.username ?? created?.Username ?? form.username.trim(),
          password: created?.password ?? created?.Password ?? form.password,
          createdAt: created?.createdAt ?? created?.CreatedAt ?? new Date().toISOString(),
        };
        setItems((prev) => [normalized, ...prev]);
      }
      closeModal();
    } catch (e) {
      setFormErr(e.message || t("common.error_save", "Save failed."));
    }
  };

  const requestDelete = (id) => setConfirmId(id);
  const cancelDelete = () => setConfirmId(null);

  const confirmDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    if (!id) return;

    if (useFakeAuth) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }

    try {
      await deleteLogin(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error("Delete failed:", e.message);
    }
  };

  return (
    <div className="passwords-list" style={{ width: "100%", maxWidth: 900 }}>
      <div className="d-flex align-items-center justify-content-between mb-3 w-100" style={{ gap: 12 }}>
        <h3 className="m-0">{t("passwords.title", "Passwords")}</h3>
        <div className="d-flex" style={{ gap: 8 }}>
          <input
            className="form-control"
            placeholder={t("passwords.search_placeholder", "Search domain or username")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <button className="btn-action" onClick={openAdd}>+ {t("common.add", "Add")}</button>
        </div>
      </div>

      {loading && <div className="text-muted mb-2">{t("common.loading", "Loading…")}</div>}

      <div className="list-group w-100">
        {filtered.map((row) => {
          const isShown = shown.has(row.id);
          return (
            <div
              key={row.id}
              className="list-group-item d-flex align-items-center justify-content-between"
              style={{ background: "var(--surface-2)", borderColor: "var(--border)", gap: 12 }}
            >
              <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                <strong style={{ color: "var(--text)" }}>{row.domain}</strong>
                <small className="text-muted">
                  {isShown ? row.username : mask(row.username)}
                </small>
                <code style={{ marginTop: 4 }}>
                  {isShown ? row.password : mask(row.password)}
                </code>
                <small className="text-muted" style={{ marginTop: 4 }}>
                  {t("passwords.created_at", "Created")}:{" "}
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                </small>
              </div>

              <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                <button className="btn-action" onClick={() => toggleShow(row.id)}>
                  {isShown ? t("cards.hide", "Hide") : t("cards.show", "Show")}
                </button>
                <button
                  className="btn-action"
                  onClick={() => copy(row.password)}
                  title={t("passwords.copy_password", "Copy password")}
                >
                  {t("passwords.copy_password", "Copy password")}
                </button>
                <button className="btn-action" onClick={() => openEdit(row)}>
                  {t("common.edit", "Edit")}
                </button>
                <button className="btn-action" onClick={() => requestDelete(row.id)}>
                  {t("common.delete", "Delete")}
                </button>
              </div>
            </div>
          );
        })}

        {!filtered.length && !loading && (
          <div className="text-muted p-3">{t("passwords.no_entries", "No entries.")}</div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title={editing ? t("passwords.modal_edit", "Edit password") : t("passwords.modal_add", "Add password")}
          onClose={closeModal}
        >
          {formErr && (
            <div className="alert alert-danger" role="alert" style={{ marginBottom: "0.75rem" }}>
              {formErr}
            </div>
          )}

          <form className="login-form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="pw-domain">{t("passwords.domain_label", "Domain")}</label>
              <input
                id="pw-domain"
                type="text"
                placeholder="example.com"
                value={form.domain}
                onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pw-username">{t("passwords.username_label", "Username")}</label>
              <input
                id="pw-username"
                type="text"
                placeholder={t("passwords.username_placeholder", "your username")}
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pw-password">{t("passwords.password_label", "Password")}</label>
              <input
                id="pw-password"
                type="text"
                placeholder={t("passwords.password_placeholder", "your password")}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <div className="d-flex justify-content-end" style={{ gap: 8, marginTop: 8 }}>
              <button type="button" className="btn-action" onClick={closeModal}>
                {t("common.cancel", "Cancel")}
              </button>
              <button type="submit" className="btn-action">
                {editing ? t("common.save", "Save") : t("common.add", "Add")}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmId !== null && (
        <Modal title={t("passwords.confirm_delete_title", "Delete entry")} onClose={cancelDelete} maxWidth={420}>
          <p className="text-muted" style={{ marginBottom: 16 }}>
            {t("passwords.confirm_delete", "Are you sure you want to delete this password entry?")}
          </p>
          <div className="d-flex justify-content-end" style={{ gap: 8 }}>
            <button className="btn-action" onClick={cancelDelete}>{t("common.cancel", "Cancel")}</button>
            <button className="btn-action" onClick={confirmDelete}>{t("common.delete", "Delete")}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PasswordsList;
