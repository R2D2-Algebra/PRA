import http from "./http";

export const getLogins = (domain) =>
  http(`/api/LoginEntry${domain ? `?domain=${encodeURIComponent(domain)}` : ""}`);

export const getLogin = (id) => http(`/api/LoginEntry/${id}`);

export const createLogin = (payload) =>
  http("/api/LoginEntry", { method: "POST", body: JSON.stringify(payload) });

export const updateLogin = (id, payload) =>
  http(`/api/LoginEntry/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteLogin = (id) => http(`/api/LoginEntry/${id}`, { method: "DELETE" });
