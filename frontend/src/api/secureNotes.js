import http from "./http";

export const getNotes = () => http("/api/SecureNote");

export const getNote = (id) => http(`/api/SecureNote/${id}`);

export const createNote = (payload) =>
  http("/api/SecureNote", { method: "POST", body: JSON.stringify(payload) });

export const updateNote = (id, payload) =>
  http(`/api/SecureNote/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteNote = (id) =>
  http(`/api/SecureNote/${id}`, { method: "DELETE" });
