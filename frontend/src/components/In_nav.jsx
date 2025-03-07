import React from "react";

function InNav() {
    return (
        <nav className="bg-gray-800 max-w-fit text-white p-4 mt-4 rounded-lg">
            <ul className="flex space-x-6">
                <li><a href="/crops" className="hover:text-green-400">Home</a></li>
                <li><a href="/plant" className="hover:text-green-400">Plantation details</a></li>
                <li><a href="/wee" className="hover:text-green-400">Weather</a></li>
                <li><a href="/detect" className="hover:text-green-400">Disease identification</a></li>
            </ul>
        </nav>
    );
}

export default InNav;