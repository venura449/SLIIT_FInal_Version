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
            const user = JSON.parse(sessionStorage.getItem("user"));
            const email = user?.email || "";
            const response = await fetch(`http://localhost:5000/api/crops/getcrops/${email}`);
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

    useEffect(() => {
        console.log("Updated selectedCropDetails:", selectedCropDetails);
    }, [selectedCropDetails]); // Runs whenever `selectedCropDetails` updates

    const fetchCropDetails = async (name) => {
        try {
            const response = await fetch(`http://localhost:5000/api/pesticide-inventory/crop-details?q=${name}`, {
                method: 'GET',
            });
            const data = await response.json();

            if (data.data[0]!= null) {
                console.log("Fetched Data:", data.data[0]);
                setSelectedCropDetails(data.data[0]);
            } else {
                toast.error("Can't Find the plant...❌");
                console.error("Can't Find the plant...❌");
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
                                    <button onClick={() => updateCrop(crop)}
                                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">
                                        Update
                                    </button>
                                    <button onClick={() => deleteCrop(crop._id)}
                                            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white">
                                        Delete
                                    </button>
                                </td>
                                <td className="px-4 py-2 border border-gray-700">
                                    <button onClick={() => fetchCropDetails(crop.name)}
                                            className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white">
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
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-96 border border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-300 mb-4">🌿 Crop Details</h3>

                        {/* Access properties directly from selectedCropDetails object */}
                        <p className="text-gray-400"><strong className="text-gray-300">Common Name:</strong> {selectedCropDetails.common_name}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Scientific Name:</strong> {selectedCropDetails.scientific_name}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Year:</strong> {selectedCropDetails.year}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Bibliography:</strong> {selectedCropDetails.bibliography}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Author:</strong> {selectedCropDetails.author}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Status:</strong> {selectedCropDetails.status}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Rank:</strong> {selectedCropDetails.rank}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Family:</strong> {selectedCropDetails.family}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Genus:</strong> {selectedCropDetails.genus}</p>

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedCropDetails(null)}
                            className="mt-4 bg-[#333] hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-lg transition duration-300"
                        >
                            ❌ Close
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Modal for updating a crop */}
            {updateModalOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-96 border border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-300 mb-4">🌿 Update Crop</h3>
                        <form onSubmit={handleUpdateCrop}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedCrop.name}
                                    onChange={handleUpdateChange}
                                    className="w-full px-4 py-2 rounded-md bg-[#333] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Crop Name"
                                    required
                                />
                                <input
                                    type="text"
                                    name="bedLocation"
                                    value={selectedCrop.bedLocation}
                                    onChange={handleUpdateChange}
                                    className="w-full px-4 py-2 rounded-md bg-[#333] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Bed Location"
                                    required
                                />
                                <input
                                    type="date"
                                    name="plantedDate"
                                    value={selectedCrop.plantedDate}
                                    onChange={handleUpdateChange}
                                    className="w-full px-4 py-2 rounded-md bg-[#333] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                                <input
                                    type="date"
                                    name="estimatedHarvestDate"
                                    value={selectedCrop.estimatedHarvestDate}
                                    onChange={handleUpdateChange}
                                    className="w-full px-4 py-2 rounded-md bg-[#333] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                                <select
                                    name="pesticideState"
                                    value={selectedCrop.pesticideState}
                                    onChange={handleUpdateChange}
                                    className="w-full px-4 py-2 rounded-md bg-[#333] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="Not Sprayed">Not Sprayed</option>
                                    <option value="Sprayed">Sprayed</option>
                                </select>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button type="submit" className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-4 py-2 rounded-lg transition duration-300">
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setUpdateModalOpen(false)}
                                    className="bg-[#F44336] hover:bg-[#D32F2F] text-white px-4 py-2 rounded-lg transition duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
            

            <ToastContainer />
            <Footer />
        </>
    );
}

export default Crops;
