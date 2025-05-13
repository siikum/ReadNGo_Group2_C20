// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    email: string;
    role: string;
    exp: number;
}

function isTokenValid(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.exp * 1000 > Date.now();
    } catch (error) {
        console.error("Invalid token format:", error);
        return false;
    }
}

export function getUserRole(): string | null {
    const token = localStorage.getItem("token");
    const staffToken = localStorage.getItem("staffToken");

    if (token && isTokenValid(token)) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.role;
        } catch {
            return null;
        }
    }

    if (staffToken && isTokenValid(staffToken)) {
        try {
            const decoded = jwtDecode<JwtPayload>(staffToken);
            return decoded.role;
        } catch {
            return null;
        }
    }

    return null;
}

export function isLoggedIn(): boolean {
    return !!getUserRole();
}

export function getUserEmail(): string | null {
    const token = localStorage.getItem("token");
    const staffToken = localStorage.getItem("staffToken");

    if (token && isTokenValid(token)) {
        return jwtDecode<JwtPayload>(token).email;
    }

    if (staffToken && isTokenValid(staffToken)) {
        return jwtDecode<JwtPayload>(staffToken).email;
    }

    return null;
}

export function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffRole");
    localStorage.removeItem("staffEmail");
    localStorage.removeItem("staffName");
}
