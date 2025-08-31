import http from "./http";

export const login = (email, password) =>
  http("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify({ email, masterPassword: password }),
  });

export const register = ({ email, password }) =>
  http("/api/Auth/register", {
    method: "POST",
    body: JSON.stringify({ email, masterPassword: password }),
  });
