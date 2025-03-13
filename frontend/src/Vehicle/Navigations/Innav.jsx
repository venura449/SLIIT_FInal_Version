import React from "react";
import { useLocation } from "react-router-dom";

function InNav() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "border-b-2 border-emerald-500 text-emerald-400" : "text-gray-300";

    return (
        <nav className="bg-gray-800 max-w-fit text-white p-4 mt-4 rounded-lg">
            <ul className="flex space-x-6">
                <li><a href="/vecdash" className={`hover:text-green-400 ${isActive("/vecdash")}`}>Home</a></li>
                <li><a href="/vecmain" className={`hover:text-green-400 ${isActive("/vecmain")}`}>Maintaince</a></li>
                <li><a href="/vecrun" className={`hover:text-green-400 ${isActive("/vecrun")}`}>Running Charts</a></li>
                <li><a href="/vecfuel" className={`hover:text-green-400 ${isActive("/vecfuel")}`}>Fuel Records</a></li>
                <li><a href="/detect" className={`hover:text-green-400 ${isActive("/detect")}`}>Assigned Vehicles</a></li>
            </ul>
        </nav>
    );
}

export default InNav;
