import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Innav from "../Vehicle/Navigations/Innav.jsx";
import { motion } from "framer-motion";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [newVehicle, setNewVehicle] = useState({
        model: "",
        brand: "",
        registrationNumber: "",
        Assigned_driver: "",
        fuelType: "Petrol",
        status: "Available",
        user_email: "",
    });

    // Fetch vehicles from the server
    const fetchVehicles = async () => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            const email = user?.email || "";
            if (!email) {
                toast.error("User email not found!");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/vec/vehicles/${email}`);
            const data = await response.json();
            if (data.success) {
                setVehicles(data.data);
            } else {
                toast.error("Error fetching vehicles: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while fetching vehicles.");
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Handle form changes for new vehicle
    const handleChange = (e) => {
        setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
    };

    // Add new vehicle
    const addVehicle = async (e) => {
        e.preventDefault();
        const user = JSON.parse(sessionStorage.getItem("user"));
        const email = user?.email || "";
        if (!email) {
            toast.error("User email not found!");
            return;
        }

        const vehicleWithUserEmail = { ...newVehicle, user_email: email };

        try {
            const response = await fetch("http://localhost:5000/api/vec/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehicleWithUserEmail),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Vehicle added successfully!");
                setNewVehicle({
                    model: "",
                    brand: "",
                    registrationNumber: "",
                    Assigned_driver: "",
                    fuelType: "Petrol",
                    status: "Available",
                    user_email: "",
                });
                fetchVehicles();
                setModalOpen(false);
            } else {
                toast.error("Error adding vehicle: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while adding the vehicle.");
        }
    };

    // Update vehicle
    const updateVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setUpdateModalOpen(true);
    };

    // Handle update form change
    const handleUpdateChange = (e) => {
        setSelectedVehicle({ ...selectedVehicle, [e.target.name]: e.target.value });
    };

    // Submit updated vehicle
    const handleUpdateVehicle = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/vec/vehicles/${selectedVehicle._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedVehicle),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Vehicle updated successfully!");
                fetchVehicles();
                setUpdateModalOpen(false);
            } else {
                toast.error("Error updating vehicle: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while updating the vehicle.");
        }
    };

    // Delete vehicle
    const deleteVehicle = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this vehicle?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/vec/vehicles/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Vehicle deleted successfully.");
                fetchVehicles();
            } else {
                toast.error("Error deleting vehicle: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the vehicle.");
        }
    };

    return (
        <>
            <Header />
            <div className={`container mx-auto p-6 ${modalOpen || updateModalOpen ? "blur-md" : ""}`}>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Vehicle List</h2>

                <div className="flex justify-between items-center">
                    <Innav />
                    <button onClick={() => setModalOpen(true)} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white">
                        Add New Vehicle
                    </button>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-gray-200">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 border border-gray-700">Brand</th>
                            <th className="px-4 py-2 border border-gray-700">Model</th>
                            <th className="px-4 py-2 border border-gray-700">Running Hours</th>
                            <th className="px-4 py-2 border border-gray-700">Assigned Driver</th>
                            <th className="px-4 py-2 border border-gray-700">Statue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle._id} className="bg-gray-900 hover:bg-gray-800">
                                <td className="px-4 py-2 border border-gray-700">{vehicle.brand}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.model}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.curr_running_hours}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.Assigned_driver}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Vehicle Modal */}
            {modalOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-200 mb-2">Add New Vehicle</h2>
                        <form onSubmit={addVehicle} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="model"
                                placeholder="Model"
                                value={newVehicle.model}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="brand"
                                placeholder="Brand"
                                value={newVehicle.brand}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="registrationNumber"
                                placeholder="Registration Number"
                                value={newVehicle.registrationNumber}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="Assigned_driver"
                                placeholder="Assigned Driver"
                                value={newVehicle.Assigned_driver}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <select
                                name="fuelType"
                                value={newVehicle.fuelType}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white">Add Vehicle</button>
                        </form>
                        <button onClick={() => setModalOpen(false)} className="text-red-600 hover:text-red-500 mt-2">Cancel</button>
                    </div>
                </motion.div>
            )}
            {/* Update Vehicle Modal */}
            {updateModalOpen && selectedVehicle && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex justify-center items-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-200 mb-2">Update Vehicle</h2>
                        <form onSubmit={handleUpdateVehicle} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="model"
                                placeholder="Model"
                                value={selectedVehicle.model}
                                onChange={handleUpdateChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="brand"
                                placeholder="Brand"
                                value={selectedVehicle.brand}
                                onChange={handleUpdateChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="registrationNumber"
                                placeholder="Registration Number"
                                value={selectedVehicle.registrationNumber}
                                onChange={handleUpdateChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="Assigned_driver"
                                placeholder="Assigned Driver"
                                value={selectedVehicle.Assigned_driver}
                                onChange={handleUpdateChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <select
                                name="fuelType"
                                value={selectedVehicle.fuelType}
                                onChange={handleUpdateChange}
                                className="p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white">Update Vehicle</button>
                        </form>
                        <button
                            onClick={() => setUpdateModalOpen(false)}
                            className="text-red-600 hover:text-red-500 mt-2"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            )}

            <ToastContainer />
            <Footer/>
        </>
    );
}

export default Vehicles;
