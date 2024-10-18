// AuthRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (token) {
        // If user is already logged in, redirect them to homepage
        return <Navigate to="/" />;
    }

    // If not logged in, render the requested component (login or register)
    return children;
};

export default AuthRoute;
