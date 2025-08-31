import http from "./http";

export const getCards   = () => http("/api/CreditCard");
export const getCard    = (id) => http(`/api/CreditCard/${id}`);
export const createCard = (payload) =>
  http("/api/CreditCard", { method: "POST", body: JSON.stringify(payload) });
export const updateCard = (id, payload) =>
  http(`/api/CreditCard/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteCard = (id) =>
  http(`/api/CreditCard/${id}`, { method: "DELETE" });
