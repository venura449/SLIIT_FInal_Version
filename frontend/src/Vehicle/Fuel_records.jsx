import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Innav from "./Navigations/Innav.jsx";
import { motion } from "framer-motion";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [fuelModalOpen, setFuelModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [fuelRecord, setFuelRecord] = useState({
        vehicleId: "",
        fuelAmount: "",
        fuelDate: "",
        fuelType: "Petrol"
    });

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


    // Add Fuel Record
    const handleFuelRecordChange = (e) => {
        setFuelRecord({ ...fuelRecord, [e.target.name]: e.target.value });
    };

    const addFuelRecord = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/vec/fuel-records`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fuelRecord),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Fuel record added successfully!");
                fetchVehicles();
                setFuelModalOpen(false);
                setFuelRecord({
                    vehicleId: "",
                    fuelAmount: "",
                    fuelDate: "",
                    fuelType: "Petrol"
                });
            } else {
                toast.error("Error adding fuel record: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while adding the fuel record.");
        }
    };

    // Update vehicle - specifically running hours
    const updateVehicle = (vehicle) => {
        setSelectedVehicle({ ...vehicle, curr_running_hours: vehicle.curr_running_hours });
        setUpdateModalOpen(true);
    };

    // Handle update form change for running hours
    const handleUpdateChange = (e) => {
        setSelectedVehicle({ ...selectedVehicle, curr_running_hours: e.target.value });
    };

    // Submit updated vehicle (only running hours)
    const handleUpdateVehicle = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/vec/vehicles/${selectedVehicle._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ curr_running_hours: selectedVehicle.curr_running_hours }), // Only update running hours
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Vehicle running hours updated successfully!");
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
            <div className={`container mx-auto p-6 ${modalOpen || updateModalOpen || fuelModalOpen ? "blur-md" : ""}`}>
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
                            <th className="px-4 py-2 border border-gray-700">Current Fuel Amount(L)</th>
                            <th className="px-4 py-2 border border-gray-700">Current State</th>
                            <th className="px-4 py-2 border border-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle._id} className="bg-gray-900 hover:bg-gray-800">
                                <td className="px-4 py-2 border border-gray-700">{vehicle.brand}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.model}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.curr_running_hours}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.fuelAmount}</td>
                                <td className="px-4 py-2 border border-gray-700">{vehicle.status}</td>
                                <td className="px-4 py-2 border border-gray-700">
                                    <button onClick={() => {
                                        setFuelRecord({...fuelRecord, vehicleId: vehicle._id});
                                        setFuelModalOpen(true);
                                    }} className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white">Add Fuel
                                        Record
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Fuel Record Modal */}
            {fuelModalOpen && (
                <motion.div
                    initial={{opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)"}}
                    animate={{opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-200 mb-2">Add Fuel Record</h2>
                        <form onSubmit={addFuelRecord} className="flex flex-col gap-4">
                            <input
                                type="number"
                                name="fuelAmount"
                                placeholder="Fuel Amount (in Liters)"
                                value={fuelRecord.fuelAmount}
                                onChange={handleFuelRecordChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                type="date"
                                name="fuelDate"
                                value={fuelRecord.fuelDate}
                                onChange={handleFuelRecordChange}
                                className="p-2 rounded bg-gray-700 text-white"
                                required
                            />
                            <select
                                name="fuelType"
                                value={fuelRecord.fuelType}
                                onChange={handleFuelRecordChange}
                                className="p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white">Add Fuel Record</button>
                        </form>
                        <button onClick={() => setFuelModalOpen(false)} className="text-red-600 hover:text-red-500 mt-2">Cancel</button>
                    </div>
                </motion.div>
            )}

            <ToastContainer />
            <Footer />
        </>
    );
}

export default Vehicles;
