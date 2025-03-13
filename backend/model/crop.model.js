import mongoose from 'mongoose';

const CropSchema = new mongoose.Schema({
    plantId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bedLocation: { type: String, required: true },
    plantedDate: { type: Date, required: true },
    pesticideState: { type: String, required: true, enum: ["Healthy", "Treated", "Infested"] }
}, { timestamps: true });

export default mongoose.model('Crop', CropSchema);
