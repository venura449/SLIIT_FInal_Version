import { motion } from "framer-motion";
import { Users, ClipboardList, CalendarCheck, SprayCan, CloudSun, DollarSign, TrendingUp, BarChart, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header_emp.jsx";
import Footer from "../components/Footer.jsx";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex overflow-hidden flex-col  justify-between text-white">
            {/* Toast Notifications */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* Top Navigation */}
            <Header />

            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mt-10"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Welcome Back to Employees Portal
                </h1>
                <div className="mt-8 flex flex-wrap justify-center gap-8">
                    <CategoryCard title="Add Attendance" icon={Users} onClick={() => navigate("/emp")} />
                    <CategoryCard title="View Assigned Tasks" icon={ClipboardList} onClick={() => navigate("/tasks")} />
                    <CategoryCard title="Apply for Leaves" icon={CalendarCheck} onClick={() => navigate("/leaves")} />
                    <CategoryCard title="Update Pesticide Details" icon={SprayCan} onClick={() => navigate("/emppes")} />
                    <CategoryCard title="View Weather" icon={CloudSun} onClick={() => navigate("/empweather")} />
                    <CategoryCard title="Add Expense Request" icon={DollarSign} onClick={() => navigate("/expenses")} />
                    <CategoryCard title="Add Income Request" icon={TrendingUp} onClick={() => navigate("/income")} />
                    <CategoryCard title="Update Running Charts" icon={BarChart} onClick={() => navigate("/charts")} />
                    <CategoryCard title="Update Fuel Records" icon={Fuel} onClick={() => navigate("/fuel")} />
                </div>
            </motion.div>

            <Footer />
        </div>
    );
};

// Category Card Component with Square Icons and Hover Effects
const CategoryCard = ({ title, icon: Icon, onClick }) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                rotate: 2,
                backgroundColor: "#16a34a", // Green hover color
                transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                toast.success(`${title} selected! 🚀`);
                onClick();
            }}
            className="flex flex-col items-center justify-center w-40 h-40 bg-gray-800 rounded-xl shadow-lg cursor-pointer transition-all p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ rotate: 5 }}
            >
                <Icon size={50} className="text-green-300" />
            </motion.div>
            <p className="mt-2 text-sm font-semibold text-white text-center">{title}</p>
        </motion.div>
    );
};

export default Dashboard;
