import mongoose from 'mongoose';

const pesticideInventorySchema = new mongoose.Schema({
    pesticideName: { type: String, required: true },
    pesticideType: { type: String, required: true },
    user_email: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    pricePerUnit: { type: Number, required: false },
    notes: { type: String, default: '' },
});

const PesticideInventory = mongoose.model('PesticideInventory', pesticideInventorySchema);

export default PesticideInventory;
