import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/secureNotes.js";

const MOCK = [
  { id: 1, title: "Wi-Fi", content: "Home SSID: MyNet\nPassword: superSecret123" },
  { id: 2, title: "Ideas", content: "Ship MVP, then iterate.\n• Notes grid\n• Tags later" },
];

const Modal = ({ title, children, onClose, width = 520 }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
  >
    <div className="login-modal" style={{ maxWidth: width }}>
      <button className="close-btn" onClick={onClose}>×</button>
      <h2 className="login-title" style={{ marginBottom: "1rem" }}>{title}</h2>
      {children}
    </div>
  </div>
);

export default function SecureNotes() {
  const { useFakeAuth } = useAuth();

  const [notes, setNotes] = useState(MOCK);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", content: "" });
  const [addErr, setAddErr] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [editErr, setEditErr] = useState("");

  useEffect(() => {
    const load = async () => {
      if (useFakeAuth) { setNotes(MOCK); return; }
      try {
        setLoading(true);
        const data = await getNotes();
        setNotes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Notes load failed:", e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [useFakeAuth]);

  const filtered = useMemo(() => {
    if (!q) return notes;
    const s = q.toLowerCase();
    return notes.filter(n =>
      (n.title || "").toLowerCase().includes(s) ||
      (n.content || "").toLowerCase().includes(s)
    );
  }, [notes, q]);

  const openAdd = () => { setIsAddOpen(true); setAddForm({ title: "", content: "" }); setAddErr(""); };
  const closeAdd = () => setIsAddOpen(false);

  const submitAdd = async (e) => {
    e.preventDefault();
    if (!addForm.title.trim()) return setAddErr("Title is required.");
    const payload = { title: addForm.title.trim(), content: addForm.content || "" };

    if (useFakeAuth) {
      const nextId = Math.max(0, ...notes.map(n => n.id || 0)) + 1;
      setNotes(prev => [{ id: nextId, ...payload }, ...prev]);
      closeAdd();
      return;
    }

    try {
      const created = await createNote(payload);
      setNotes(prev => [created ?? payload, ...prev]);
      closeAdd();
    } catch (e) {
      setAddErr(e.message || "Failed to create note.");
    }
  };

  const beginEdit = (note) => {
    setEditingId(note.id);
    setEditForm({ title: note.title || "", content: note.content || "" });
    setEditErr("");
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({ title: "", content: "" }); setEditErr(""); };

  const saveEdit = async (id) => {
    if (!editForm.title.trim()) return setEditErr("Title is required.");
    const payload = { title: editForm.title.trim(), content: editForm.content || "" };

    if (useFakeAuth) {
      setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...payload } : n)));
      cancelEdit();
      return;
    }

    try {
      await updateNote(id, payload);
      setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...payload } : n)));
      cancelEdit();
    } catch (e) {
      setEditErr(e.message || "Failed to save.");
    }
  };

  const remove = async (id) => {
    const n = notes.find(x => x.id === id);
    if (!n) return;
    if (!confirm(`Delete note "${n.title}"?`)) return;

    if (useFakeAuth) {
      setNotes(prev => prev.filter(x => x.id !== id));
      if (editingId === id) cancelEdit();
      return;
    }

    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(x => x.id !== id));
      if (editingId === id) cancelEdit();
    } catch (e) {
      console.error("Delete failed:", e.message);
    }
  };

  return (
    <div className="notes-wrap">
      <div className="notes-header">
        <h2>Notes</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="cc-search"
            placeholder="Search notes…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-action" onClick={openAdd}>+ Add</button>
        </div>
      </div>

      {loading && <div className="text-muted mb-2">Loading…</div>}

      <div className="notes-grid">
        {filtered.map(note => {
          const isEditing = editingId === note.id;
          return (
            <div className="note-card" key={note.id}>
              <button className="note-close" onClick={() => remove(note.id)} aria-label="Delete note">×</button>

              {!isEditing ? (
                <>
                  <div className="note-title">{note.title}</div>
                  <div className="note-content">{note.content}</div>

                  <div className="note-actions">
                    <button className="btn-action" onClick={() => beginEdit(note)}>Edit</button>
                  </div>
                </>
              ) : (
                <>
                  {editErr && <div className="alert alert-danger" role="alert" style={{ marginBottom: 8 }}>{editErr}</div>}
                  <input
                    className="note-input"
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                  />
                  <textarea
                    className="note-textarea"
                    placeholder="Write your note…"
                    rows={6}
                    value={editForm.content}
                    onChange={(e) => setEditForm(f => ({ ...f, content: e.target.value }))}
                  />
                  <div className="note-actions">
                    <button className="btn-action" onClick={() => saveEdit(note.id)}>Save</button>
                    <button className="btn-action" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {!filtered.length && !loading && (
          <div className="text-muted" style={{ padding: 12 }}>No notes.</div>
        )}
      </div>

      {isAddOpen && (
        <Modal title="Add note" onClose={closeAdd}>
          {addErr && <div className="alert alert-danger" role="alert" style={{ marginBottom: 8 }}>{addErr}</div>}

          <form onSubmit={submitAdd} className="login-form">
            <div className="form-group">
              <label htmlFor="nt-title">Title</label>
              <input
                id="nt-title"
                type="text"
                value={addForm.title}
                onChange={(e) => setAddForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g., Server checklist"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nt-content">Content</label>
              <textarea
                id="nt-content"
                rows={8}
                value={addForm.content}
                onChange={(e) => setAddForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write anything…"
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn-action" onClick={closeAdd}>Cancel</button>
              <button type="submit" className="btn-action">Add</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
