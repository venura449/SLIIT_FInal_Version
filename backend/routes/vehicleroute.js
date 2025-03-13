import express from 'express';
import Vehicle from '../model/vehicle.model.js';

const router = express.Router();

// Route to fetch all vehicles
router.get("/vehicles", async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to fetch vehicles by user's email
router.get("/vehicles/:email", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ user_email: req.params.email });
        if (!vehicles) return res.status(404).json({ message: "No vehicles found" });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to add a new vehicle
router.post("/vehicles", async (req, res) => {
    try {
        const newVehicle = new Vehicle(req.body);
        await newVehicle.save();
        res.status(201).json({ success: true, message: 'Vehicle added to the System' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to update a vehicle by ID
router.put("/vehicles/:id", async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.status(201).json({ success: true, message: 'Vehicle Updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to delete a vehicle by ID
router.delete("/vehicles/:id", async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.status(201).json({ success: true, message: 'Vehicle deleted Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/vehicles/update-running-hours/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { curr_running_hours } = req.body; // New running hours

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({ success: false, error: "Vehicle not found" });
        }

        vehicle.curr_running_hours = curr_running_hours; // Update running hours
        await vehicle.save();

        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, error: "An error occurred while updating the vehicle's running hours" });
    }
});

export default router;
