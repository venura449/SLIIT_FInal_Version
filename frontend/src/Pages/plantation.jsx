import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Innav from "../components/In_nav.jsx";

function Crops() {
    const [crops, setCrops] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedCropDetails, setSelectedCropDetails] = useState(null);

    const [newCrop, setNewCrop] = useState({
        plantId: "",
        name: "",
        bedLocation: "",
        plantedDate: "",
        estimatedHarvestDate: "",
        pesticideState: "Not Sprayed",
    });

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/crops/getcrops");
            const data = await response.json();
            if (data.success) {
                setCrops(data.data);
            } else {
                console.error("Error fetching crops:", data.error);
            }
        } catch (error) {
            console.error("An error occurred while fetching crops:", error);
        }
    };

    const handleChange = (e) => {
        setNewCrop({ ...newCrop, [e.target.name]: e.target.value });
    };

    const addCrop = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/crops/addcrop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCrop),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Crop added successfully!");
                setNewCrop({ plantId: "", name: "", bedLocation: "", plantedDate: "", estimatedHarvestDate: "", pesticideState: "Healthy" });
                fetchCrops();
                setModalOpen(false);
            } else {
                toast.error("Error adding crop: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while adding the crop.");
        }
    };

    const updateCrop = (crop) => {
        setSelectedCrop({ ...crop });
        setUpdateModalOpen(true);
    };

    const handleUpdateChange = (e) => {
        setSelectedCrop({ ...selectedCrop, [e.target.name]: e.target.value });
    };

    const handleUpdateCrop = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/crops/update/${selectedCrop._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedCrop),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Crop updated successfully!");
                fetchCrops();
                setUpdateModalOpen(false);
            } else {
                toast.error("Error updating crop: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while updating the crop.");
        }
    };

    const deleteCrop = async (id) => {
        if (!window.confirm(`Are you sure you want to delete crop with ID: ${id}?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/crops/remove/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Crop deleted successfully.");
                await fetchCrops();
            } else {
                toast.error("Error deleting crop: " + data.error);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the crop.");
        }
    };

    const fetchCropDetails = async (name) => {
        try {
            const response = await fetch(`https://trefle.io/api/v1/plants/search?token=4s5YsGGfrKNwfvzi3cY_qeXYLbQxN3XCy245pnOUL9A&q=${name}`);
            const data = await response.json();
            if (data.success) {
                setSelectedCropDetails(data.data);
            } else {
                console.error("Error fetching crop details:", data.error);
            }
        } catch (error) {
            console.error("An error occurred while fetching crop details:", error);
        }
    };

    return (
        <>
            <Header />
            <div className={`container mx-auto p-6 ${modalOpen || updateModalOpen ? "blur-md" : ""}`}>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Crop List
                </h2>

                <div className="flex justify-between items-center">
                    <Innav />
                    <button onClick={() => setModalOpen(true)}
                            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white">
                        Add New Crop
                    </button>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-gray-200">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 border border-gray-700">Plant ID</th>
                            <th className="px-4 py-2 border border-gray-700">Name</th>
                            <th className="px-4 py-2 border border-gray-700">Planted Date</th>
                            <th className="px-4 py-2 border border-gray-700">Estimated Harvest Date</th>
                            <th className="px-4 py-2 border border-gray-700">Pesticide State</th>
                            <th className="px-4 py-2 border border-gray-700">Actions</th>
                            <th className="px-4 py-2 border border-gray-700">View More</th>
                        </tr>
                        </thead>
                        <tbody>
                        {crops.map((crop) => (
                            <tr key={crop._id} className="bg-gray-900 hover:bg-gray-800">
                                <td className="px-4 py-2 border border-gray-700">{crop.plantId}</td>
                                <td className="px-4 py-2 border border-gray-700">{crop.name}</td>
                                <td className="px-4 py-2 border border-gray-700">
                                    {new Date(crop.plantedDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 border border-gray-700">
                                    {crop.estimatedHarvestDate ? new Date(crop.estimatedHarvestDate).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="px-4 py-2 border border-gray-700">{crop.pesticideState}</td>
                                <td className="px-4 py-2 border border-gray-700 space-x-2">
                                    <button onClick={() => updateCrop(crop)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">
                                        Update
                                    </button>
                                    <button onClick={() => deleteCrop(crop._id)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white">
                                        Delete
                                    </button>
                                </td>
                                <td className="px-4 py-2 border border-gray-700">
                                    <button onClick={() => fetchCropDetails(crop.name)} className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white">
                                        View More
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View More Modal */}
            {selectedCropDetails && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Crop Details</h3>
                        <p><strong>Plant ID:</strong> {selectedCropDetails.plantId}</p>
                        <p><strong>Name:</strong> {selectedCropDetails.name}</p>
                        <p><strong>Planted Date:</strong> {new Date(selectedCropDetails.plantedDate).toLocaleDateString()}</p>
                        <p><strong>Estimated Harvest Date:</strong> {new Date(selectedCropDetails.estimatedHarvestDate).toLocaleDateString()}</p>
                        <p><strong>Pesticide State:</strong> {selectedCropDetails.pesticideState}</p>
                        <button onClick={() => setSelectedCropDetails(null)} className="mt-4 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Modal for adding new crop */}
            {modalOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Add New Crop</h3>
                        <form onSubmit={addCrop}>
                            <input
                                type="text"
                                name="plantId"
                                value={newCrop.plantId}
                                onChange={handleChange}
                                placeholder="Plant ID"
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="name"
                                value={newCrop.name}
                                onChange={handleChange}
                                placeholder="Crop Name"
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="plantedDate"
                                value={newCrop.plantedDate}
                                onChange={handleChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="estimatedHarvestDate"
                                value={newCrop.estimatedHarvestDate}
                                onChange={handleChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <select
                                name="pesticideState"
                                value={newCrop.pesticideState}
                                onChange={handleChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Healthy">Healthy</option>
                                <option value="Not Sprayed">Not Sprayed</option>
                                <option value="Sprayed">Sprayed</option>
                            </select>
                            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded">
                                Add Crop
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {/* Modal for updating a crop */}
            {updateModalOpen && selectedCrop && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Update Crop</h3>
                        <form onSubmit={handleUpdateCrop}>
                            <input
                                type="text"
                                name="plantId"
                                value={selectedCrop.plantId}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="name"
                                value={selectedCrop.name}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="plantedDate"
                                value={selectedCrop.plantedDate}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                name="estimatedHarvestDate"
                                value={selectedCrop.estimatedHarvestDate}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <select
                                name="pesticideState"
                                value={selectedCrop.pesticideState}
                                onChange={handleUpdateChange}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            >
                                <option value="Healthy">Healthy</option>
                                <option value="Not Sprayed">Not Sprayed</option>
                                <option value="Sprayed">Sprayed</option>
                            </select>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded">
                                Update Crop
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
            <Footer />
        </>
    );
}

export default Crops;
