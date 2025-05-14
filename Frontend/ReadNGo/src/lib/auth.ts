
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    email: string;
    role: string;
    exp: number;
}

export function getUserRole(): string | null {
    // First check for regular token
    const token = localStorage.getItem("token");
    const staffToken = localStorage.getItem("staffToken");

    try {
        // Try regular token first
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            // Check if token is not expired
            if (decoded.exp * 1000 > Date.now()) {
                return decoded.role;
            }
        }

        // If no regular token or it's expired, try staff token
        if (staffToken) {
            const decoded = jwtDecode<JwtPayload>(staffToken);
            // Check if token is not expired
            if (decoded.exp * 1000 > Date.now()) {
                return decoded.role;
            }
        }
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }

    return null;
}