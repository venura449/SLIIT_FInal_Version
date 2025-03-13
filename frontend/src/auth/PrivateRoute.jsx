import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// PrivateRoute component
const PrivateRoute = () => {
    const isAuthenticated = sessionStorage.getItem("user") !== null; // Check if the user is authenticated

    // If authenticated, render the nested routes, otherwise redirect to login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
