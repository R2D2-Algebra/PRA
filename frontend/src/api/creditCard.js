import apiClient from "./client";

export const getCards = () => apiClient.get("/creditcard");
export const addCard = (card) => apiClient.post("/creditcard", card);
