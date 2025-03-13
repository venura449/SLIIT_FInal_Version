import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header_emp.jsx";
import Footer from "../components/Footer.jsx";
import Innav from "../Employee_portal/InnerNavigations/CropInnav.jsx";

function PesticideInventory() {
    const [pesticides, setPesticides] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedPesticide, setSelectedPesticide] = useState(null);
    const [newPesticide, setNewPesticide] = useState({
        pesticideName: "",
        quantity: "",
        purchaseDate: "",
        expiryDate: "",
        pricePerUnit : 100,
        pesticideType: "Insecticide",
    });

    useEffect(() => {
        fetchPesticides();
    }, []);

    const fetchPesticides = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/pesticide-inventory/");
            const data = await response.json();
            if (data.success) {
                setPesticides(data.data);
            } else {
                console.error("Error fetching pesticides:", data.error);
            }
        } catch (error) {
            console.error("An error occurred while fetching pesticides:", error);
        }
    };

    const handleChange = (e) => {
        setNewPesticide({ ...newPesticide, [e.target.name]: e.target.value });
    };

    const addPesticide = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/pesticide-inventory/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPesticide),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Pesticide added successfully!");
                setNewPesticide({ pesticideName: "", quantity: "", purchaseDate: "", expiryDate: "", pesticideType: "Insecticide" });
                await fetchPesticides();
                setModalOpen(false);
            } else {
                toast.error("Error adding pesticide: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while adding the pesticide.");
        }
    };

    const updatePesticide = (pesticide) => {
        setSelectedPesticide({ ...pesticide });
        setUpdateModalOpen(true);
    };

    const handleUpdateChange = (e) => {
        setSelectedPesticide({ ...selectedPesticide, [e.target.name]: e.target.value });
    };

    const handleUpdatePesticide = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/pesticide-inventory/update/${selectedPesticide._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedPesticide),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Pesticide updated successfully!");
                await fetchPesticides();
                setUpdateModalOpen(false);
            } else {
                toast.error("Error updating pesticide: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while updating the pesticide.");
        }
    };

    const deletePesticide = async (id) => {
        if (!window.confirm(`Are you sure you want to delete pesticide with ID: ${id}?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/pesticide-inventory/delete/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Pesticide deleted successfully.");
                await fetchPesticides();
            } else {
                toast.error("Error deleting pesticide: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the pesticide.");
        }
    };

    return (
        <>
            <Header />
            <div className={`container mx-auto p-6 ${modalOpen || updateModalOpen ? "blur-md" : ""}`}>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Pesticide Inventory
                </h2>

                <div className="flex justify-between items-center">
                    <Innav />
                    <button onClick={() => setModalOpen(true)} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white">
                        Add New Pesticide
                    </button>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-gray-200">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 border border-gray-700">Name</th>
                            <th className="px-4 py-2 border border-gray-700">Type</th>
                            <th className="px-4 py-2 border border-gray-700">Purchase Date</th>
                            <th className="px-4 py-2 border border-gray-700">Expiry Date</th>
                            <th className="px-4 py-2 border border-gray-700">Quantity</th>
                            <th className="px-4 py-2 border border-gray-700">Unit Price</th>
                            <th className="px-4 py-2 border border-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pesticides.map((pesticide) => (
                            <tr key={pesticide._id} className="bg-gray-900 hover:bg-gray-800">
                                <td className="px-4 py-2 border border-gray-700">{pesticide.pesticideName}</td>
                                <td className="px-4 py-2 border border-gray-700">{pesticide.pesticideType}</td>
                                <td className="px-4 py-2 border border-gray-700">{new Date(pesticide.purchaseDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border border-gray-700">{pesticide.expiryDate ? new Date(pesticide.expiryDate).toLocaleDateString() : "N/A"}</td>
                                <td className="px-4 py-2 border border-gray-700">{pesticide.quantity}</td>
                                <td className="px-4 py-2 border border-gray-700">{pesticide.pricePerUnit}</td>
                                <td className="px-4 py-2 border border-gray-700 space-x-2">
                                    <button onClick={() => updatePesticide(pesticide)}
                                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">
                                        Update
                                    </button>
                                    <button onClick={() => deletePesticide(pesticide._id)}
                                            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Pesticide Modal */}
            {modalOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Add New Pesticide</h3>
                        <form onSubmit={addPesticide}>
                            <input
                                type="text"
                                name="pesticideName"
                                value={newPesticide.pesticideName}
                                onChange={handleChange}
                                placeholder="Pesticide Name"
                                required
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={newPesticide.quantity}
                                onChange={handleChange}
                                placeholder="Quantity"
                                required
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="purchaseDate"
                                value={newPesticide.purchaseDate}
                                onChange={handleChange}
                                required
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="expiryDate"
                                value={newPesticide.expiryDate}
                                onChange={handleChange}
                                required
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <select
                                name="pesticideType"
                                value={newPesticide.pesticideType}
                                onChange={handleChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Insecticide">Insecticide</option>
                                <option value="Herbicide">Herbicide</option>
                                <option value="Fungicide">Fungicide</option>
                            </select>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}


            {/* Update Pesticide Modal */}
            {updateModalOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Update Pesticide</h3>
                        <form onSubmit={handleUpdatePesticide}>
                            <input
                                type="text"
                                name="pesticideName"
                                value={selectedPesticide.pesticideName}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={selectedPesticide.quantity}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="purchaseDate"
                                value={selectedPesticide.purchaseDate}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="expiryDate"
                                value={selectedPesticide.expiryDate}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="pricePerUnit"
                                value={selectedPesticide.pricePerUnit}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <select
                                name="pesticideType"
                                value={selectedPesticide.pesticideType}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Insecticide">Insecticide</option>
                                <option value="Herbicide">Herbicide</option>
                                <option value="Fungicide">Fungicide</option>
                            </select>
                            <div className="flex justify-between">
                                <button type="submit"
                                        className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded">
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUpdateModalOpen(false)}
                                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}


            <ToastContainer/>
            <Footer/>
        </>
    );
}

export default PesticideInventory;
