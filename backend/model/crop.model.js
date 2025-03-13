import mongoose from 'mongoose';

const CropSchema = new mongoose.Schema({
    plantId: { type: String, required: true },
    user_email: { type: String, required: true },
    name: { type: String, required: true },
    bedLocation: { type: String, required: true },
    plantedDate: { type: Date, required: true },
    pesticideState: { type: String, required: true, enum: ["Healthy", "Treated", "Infested"] }
}, { timestamps: true });


// Create a compound index on plantId and user_email to enforce uniqueness
CropSchema.index({ plantId: 1, user_email: 1 }, { unique: true });

export default mongoose.model('Crop', CropSchema);
