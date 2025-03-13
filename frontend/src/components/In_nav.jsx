import React from "react";
import { useLocation } from "react-router-dom";

function InNav() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "border-b-2 border-emerald-500 text-emerald-400" : "text-gray-300";

    return (
        <nav className="bg-gray-800 max-w-fit text-white p-4 mt-4 rounded-lg">
            <ul className="flex space-x-6">
                <li><a href="/crops" className={`hover:text-green-400 ${isActive("/crops")}`}>Home</a></li>
                <li><a href="/plant" className={`hover:text-green-400 ${isActive("/plant")}`}>Plantation details</a></li>
                <li><a href="/pestinv" className={`hover:text-green-400 ${isActive("/pestinv")}`}>Pesticide & Fertilizers</a></li>
                <li><a href="/wee" className={`hover:text-green-400 ${isActive("/wee")}`}>Weather</a></li>
                <li><a href="/detect" className={`hover:text-green-400 ${isActive("/detect")}`}>Disease identification</a></li>
            </ul>
        </nav>
    );
}

export default InNav;
