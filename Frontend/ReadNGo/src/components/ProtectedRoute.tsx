// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getUserRole } from "../lib/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const role = getUserRole();

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/start" replace />;
    }

    return children;
};

export default ProtectedRoute;
