import apiClient from "./client";

export const getLogins = () => apiClient.get("/loginentry");
export const addLogin = (entry) => apiClient.post("/loginentry", entry);
