import React from "react";
import { useLocation } from "react-router-dom";

function InNav() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "border-b-2 border-emerald-500 text-emerald-400" : "text-gray-300";

    return (
        <nav className="bg-gray-800 max-w-fit text-white p-4 mt-4 rounded-lg">
            <ul className="flex space-x-6">
                <li><a href="/empportcrop" className={`hover:text-green-400 ${isActive("/empportcrop")}`}>Home</a></li>
                <li><a href="/emppes" className={`hover:text-green-400 ${isActive("/emppes")}`}>Pesticide & Plantation</a></li>
                <li><a href="/empweather" className={`hover:text-green-400 ${isActive("/empweather")}`}>Weather</a></li>
            </ul>
        </nav>
    );
}

export default InNav;
