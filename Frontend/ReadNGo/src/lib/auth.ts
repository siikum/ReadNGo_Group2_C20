// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";


interface JwtPayload {
    email: string;
    role: string;
    exp: number;
}

export function getUserRole(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role;
    } catch {
        return null;
    }
}
