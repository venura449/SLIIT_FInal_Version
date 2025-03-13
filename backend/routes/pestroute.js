import express from 'express';
import PesticideInventory from '../model/pesticide.model.js';

const router = express.Router();

// Add a new pesticide item to the inventory
// Add a new pesticide item to the inventory
router.post('/add', async (req, res) => {
    const { pesticideName, pesticideType, quantity, supplier, purchaseDate, expiryDate, pricePerUnit, notes,user_email } = req.body;

    try {
        const newPesticide = new PesticideInventory({
            pesticideName,
            pesticideType,
            quantity,
            supplier,
            purchaseDate,
            expiryDate,
            pricePerUnit,
            notes,
            user_email,
        });

        await newPesticide.save();
        res.status(201).json({ success: true, message: 'Pesticide item added to inventory' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add pesticide item' });
    }
});

// Update an existing pesticide item
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { pesticideName, pesticideType, quantity, supplier, purchaseDate, expiryDate, pricePerUnit, notes } = req.body;

    try {
        const pesticide = await PesticideInventory.findByIdAndUpdate(id, {
            pesticideName,
            pesticideType,
            quantity,
            supplier,
            purchaseDate,
            expiryDate,
            pricePerUnit,
            notes,
        }, { new: true });

        if (!pesticide) {
            return res.status(404).json({ error: 'Pesticide item not found' });
        }

        res.status(200).json({ success: true, message: 'Pesticide item updated', data: pesticide });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update pesticide item' });
    }
});

// Get all pesticide inventory items
router.get('/', async (req, res) => {
    try {
        const pesticides = await PesticideInventory.find({});
        res.status(200).json({ success: true, data: pesticides });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pesticide inventory' });
    }
});

// Delete a pesticide item from inventory
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pesticide = await PesticideInventory.findByIdAndDelete(id);
        if (!pesticide) {
            return res.status(404).json({ error: 'Pesticide item not found' });
        }

        res.status(200).json({ success: true, message: 'Pesticide item deleted from inventory' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete pesticide item' });
    }
});

//this is plantation route
router.get('/crop-details', async (req, res) => {
    const { q } = req.query;  // Getting the crop name query parameter from the request
    if (!q) {
        return res.status(400).json({ error: 'Query parameter `q` (crop name) is required.' });
    }

    try {
        // Making request to Trefle API
        const response = await fetch(`https://trefle.io/api/v1/plants?token=-00kt59Dter0N04ygFKmpHYmkGEan18SiMkoiHiCgv0&filter[common_name]=${q}`);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch data from Trefle API');
        }

        // Parse the response JSON
        const data = await response.json();

        // Send the data back to the client
        res.json(data);
    } catch (error) {
        // If there was an error, send a 500 status with error message
        console.error('Error fetching crop details:', error);
        res.status(500).json({ error: 'Failed to fetch crop details' });
    }
});

// Get all pesticide inventory items
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const pesticides = await PesticideInventory.find({"user_email":email});
        res.status(200).json({ success: true, data: pesticides });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pesticide inventory' });
    }
});


export default router;
