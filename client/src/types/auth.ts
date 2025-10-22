// src/types/auth.ts

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    message: string;
}
