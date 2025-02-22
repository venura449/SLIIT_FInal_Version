import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import logo from "../src_img/logo.png";

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 mt-16 rounded-3xl font-[Outfit] shadow-lg"
        >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between px-8">
                {/* Left Section: Logo and Contact Info */}
                <div className="flex flex-col items-center sm:items-start mb-8 sm:mb-0">
                    <img src={logo} alt="Logo" className="h-12 w-24" />
                    <p className="text-gray-400 mt-4">contact@root.com</p>
                    <p className="text-gray-400">076-3477290</p>
                </div>

                {/* Sitemap Section */}
                <div className="space-y-4 mb-2 sm:mb-0">
                    <h3 className="font-semibold text-left text-gray-200 text-lg">Sitemap</h3>
                    <div className="space-y-2 text-left flex flex-col">
                        {["Home", "About", "Blogs", "Privacy Policy"].map((item, index) => (
                            <Link
                                key={index}
                                to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-gray-400 hover:text-emerald-400 hover:font-bold transition"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Socials Section */}
                <div className="space-y-4 mb-8 sm:mb-0">
                    <h3 className="font-semibold text-gray-200 text-lg">Follow Us</h3>
                    <div className="flex space-x-6">
                        {[FaFacebook, FaLinkedin, FaInstagram].map((Icon, index) => (
                            <motion.a
                                key={index}
                                href="#"
                                className="text-gray-400 hover:text-emerald-400 transform hover:scale-110 transition-transform duration-300"
                                whileHover={{ scale: 1.2 }}
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Head Office & Newsletter Section */}
                <div className="flex flex-col items-center sm:items-start">
                    <h3 className="font-semibold text-gray-200 text-lg">Head Office</h3>
                    <p className="text-gray-400 text-center sm:text-left">No-49/1, Fatima Estate, Narammala</p>

                    <h3 className="font-semibold text-gray-200 text-lg mt-6">Newsletter</h3>
                    <div className="flex mt-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-3 border-b border-gray-400 w-60 text-gray-200 bg-transparent focus:outline-none"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition"
                        >
                            Subscribe
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className="pt-4 text-center text-gray-500">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
            </div>
        </motion.footer>
    );
}

export default Footer;
