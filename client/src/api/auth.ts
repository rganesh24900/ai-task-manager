// src/api/auth.ts
import api from "./axios";
import type { LoginData, RegisterData } from "../types";

export const login = async (data: LoginData) => api.post('/auth/login', data)

export const register = async (data: RegisterData) => {
    return api.post("/auth/register", data);
};
export const logout = async () => {
    return api.post("/auth/logout", {});
};
