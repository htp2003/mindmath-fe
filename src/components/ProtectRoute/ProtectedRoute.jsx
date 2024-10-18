import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Manual JWT decoding
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            setIsAuthorized(false);
            return;
        }

        const decodedToken = decodeToken(token);
        if (decodedToken) {
            const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
            console.log("Decoded Token Roles:", roles);

            // Check if the user has the "Admin" role
            if (roles.includes("Admin")) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } else {
            setIsAuthorized(false); // Invalid token
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
