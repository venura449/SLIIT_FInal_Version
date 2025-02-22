import { Link, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaCog } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import logo from "../src_img/logo.png";

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    const location = useLocation(); // Get current URL

    // Function to check if a link is active
    const isActive = (path) =>
        location.pathname === path ? "border-b-2 border-emerald-500 text-emerald-400" : "text-gray-300";

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !profileRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-gray-900 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-3xl flex items-center justify-between px-8 py-4">
            {/* Logo Section */}
            <div className="flex items-center">
                <img src={logo} alt="logo" className="w-32 h-16 object-cover" />
            </div>

            {/* Navigation */}
            <nav className="space-x-6 hidden sm:flex">
                <Link to="/dash" className={`px-4 py-2 ${isActive("/dash")}`}>
                    Dashboard
                </Link>
                <Link to="/emp" className={`px-4 py-2 ${isActive("/emp")}`}>
                    Employees
                </Link>
                <Link to="/crops" className={`px-4 py-2 ${isActive("/crops") }`}>
                    Crops
                </Link>

                <Link to="/vehicles" className={`px-4 py-2 ${isActive("/vehicles")}`}>
                    Vehicles
                </Link>
                <Link to="/assets" className={`px-4 py-2 ${isActive("/assets")}`}>
                    Personal Assets
                </Link>
            </nav>

            {/* User Profile Section */}
            <div className="flex items-center gap-2 relative" ref={profileRef}>
                <UserCircle size={24} className="text-gray-300 cursor-pointer" onClick={toggleDropdown} />
                <span className="text-gray-300">Venura Jayasingha</span>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            className="absolute right-0 top-full mt-2 w-48 bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg rounded-3xl"
                            initial={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{ transformOrigin: "top" }}
                            ref={dropdownRef}
                        >
                            <ul>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-gray-200 hover:bg-emerald-600 hover:text-white rounded-lg"
                                    >
                                        <FaUser className="mr-2" />
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className="flex items-center px-4 py-2 text-gray-200 hover:bg-emerald-600 hover:text-white rounded-lg"
                                    >
                                        <FaCog className="mr-2" />
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/logout"
                                        className="flex items-center px-4 py-2 text-gray-200 hover:bg-emerald-600 hover:text-white rounded-lg"
                                    >
                                        <RiLogoutCircleRLine className="mr-2" />
                                        Log Out
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

export default Header;
