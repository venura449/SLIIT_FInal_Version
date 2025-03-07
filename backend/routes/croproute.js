import express from 'express';
import Crop from '../model/crop.model.js';



const router = express.Router();

// 🔹 Fetch all crops
router.get('/getcrops', async (req, res) => {
    try {
        const crops = await Crop.find({});
        res.status(200).json({ success: true, data: crops });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    }
});

// 🔹 Fetch a single crop by ID
router.get('/getcrop/:id', async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }
        res.status(200).json({ success: true, data: crop });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    }
});

// 🔹 Add a new crop
router.post('/addcrop', async (req, res) => {
    const { plantId, name, bedLocation, plantedDate, pesticideState } = req.body;

    if (!plantId || !name || !bedLocation || !plantedDate || !pesticideState) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
        const newCrop = new Crop({ plantId, name, bedLocation, plantedDate, pesticideState });
        await newCrop.save();
        res.status(201).json({ success: true, message: "Crop added successfully", data: newCrop });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: `Server error ${e}` });
    }
});

router.post("/addcrop", async (req, res) => {
    try {
        const { plantId, name, bedLocation, plantedDate, pesticideState } = req.body;
        const newCrop = new Crop({ plantId, name, bedLocation, plantedDate, pesticideState });
        await newCrop.save();
        res.status(201).json({ success: true, message: "Crop added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding crop", error });
    }
});

// 🔹 Update crop details
router.put('/update/:id', async (req, res) => {
    try {
        const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCrop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }
        res.status(200).json({ success: true, message: "Crop updated successfully", data: updatedCrop });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: `Server error ${e}` });
    }
});

// 🔹 Delete a crop
router.delete('/remove/:id', async (req, res) => {
    try {
        console.log("Deleting Crop with ID:", req.params.id); // Debugging
        const deletedCrop = await Crop.findByIdAndDelete(req.params.id);

        if (!deletedCrop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }

        res.status(200).json({ success: true, message: "Crop deleted successfully" });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ success: false, error: `Server error ${e}` });
    }
});



export default router;
