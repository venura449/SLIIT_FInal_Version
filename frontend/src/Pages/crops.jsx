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

    const [newCrop, setNewCrop] = useState({
        plantId: "",
        name: "",
        bedLocation: "",
        plantedDate: "",
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
                setNewCrop({ plantId: "", name: "", bedLocation: "", plantedDate: "", pesticideState: "Healthy" });
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
        setSelectedCrop({ ...crop }); // Copy crop data to state
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

    return (
        <>
            <Header />
            <div className={`container mx-auto p-6 ${modalOpen || updateModalOpen ? "blur-md" : ""}`}>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Crop
                    List</h2>

                <div className="flex justify-between items-center">
                    <Innav/>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        &nbsp;
                    </h2>
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
                            <th className="px-4 py-2 border border-gray-700">Bed Location</th>
                            <th className="px-4 py-2 border border-gray-700">Planted Date</th>
                            <th className="px-4 py-2 border border-gray-700">Pesticide State</th>
                            <th className="px-4 py-2 border border-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {crops.map((crop) => (
                            <tr key={crop._id} className="bg-gray-900 hover:bg-gray-800">
                                <td className="px-4 py-2 border border-gray-700">{crop.plantId}</td>
                                <td className="px-4 py-2 border border-gray-700">{crop.name}</td>
                                <td className="px-4 py-2 border border-gray-700">{crop.bedLocation}</td>
                                <td className="px-4 py-2 border border-gray-700">{new Date(crop.plantedDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border border-gray-700">{crop.pesticideState}</td>
                                <td className="px-4 py-2 border border-gray-700 space-x-2">
                                    <button onClick={() => updateCrop(crop)}
                                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Update
                                    </button>
                                    <button onClick={() => deleteCrop(crop._id)}
                                            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white">Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Crop Modal */}
            {modalOpen && (
                <motion.div
                    initial={{opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)"}}
                    animate={{opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                    exit={{opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)"}}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Add New Crop</h3>
                        <form onSubmit={addCrop} className="flex flex-col gap-4">
                            <input type="text" name="plantId" placeholder="Plant ID" value={newCrop.plantId} onChange={handleChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <input type="text" name="name" placeholder="Crop Name" value={newCrop.name} onChange={handleChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <input type="text" name="bedLocation" placeholder="Bed Location" value={newCrop.bedLocation} onChange={handleChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <input type="date" name="plantedDate" value={newCrop.plantedDate} onChange={handleChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <select name="pesticideState" value={newCrop.pesticideState} onChange={handleChange}
                                    className="p-2 rounded bg-gray-700 text-white">
                                <option value="Healthy">Healthy</option>
                                <option value="Treated">Treated</option>
                                <option value="Infested">Infested</option>
                            </select>
                            <button type="submit" className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-white">Add Crop</button>
                        </form>
                        <button onClick={() => setModalOpen(false)} className="text-red-400 hover:text-red-500 mt-2 font-semibold">Close</button>
                    </div>
                </motion.div>
            )}

            {/* Update Crop Modal */}
            {updateModalOpen && selectedCrop && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    exit={{ opacity: 0, scale: 0.8, backgroundColor: "rgba(0, 0, 0, 0)" }}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Update Crop</h3>
                        <form onSubmit={handleUpdateCrop} className="flex flex-col gap-4">
                            <input type="text" name="plantId" placeholder="Plant ID" value={selectedCrop.plantId} onChange={handleUpdateChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <input type="text" name="name" placeholder="Crop Name" value={selectedCrop.name} onChange={handleUpdateChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <input type="text" name="bedLocation" placeholder="Bed Location" value={selectedCrop.bedLocation} onChange={handleUpdateChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <input type="date" name="plantedDate" value={selectedCrop.plantedDate} onChange={handleUpdateChange} className="p-2 rounded bg-gray-700 text-white" required />
                            <select name="pesticideState" value={selectedCrop.pesticideState} onChange={handleUpdateChange} className="p-2 rounded bg-gray-700 text-white">
                                <option value="Healthy">Healthy</option>
                                <option value="Treated">Treated</option>
                                <option value="Infested">Infested</option>
                            </select>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white">Update Crop</button>
                        </form>
                        <button onClick={() => setUpdateModalOpen(false)} className="text-red-400 hover:text-red-500 mt-2 font-semibold">Close</button>
                    </div>
                </motion.div>
            )}



            <ToastContainer />
            <Footer />
        </>
    );
}

export default Crops;
