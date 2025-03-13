import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    model: { type: String, required: true },
    brand: { type: String, required: true },
    user_email:{type:String,required: true},
    fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], required: true },
    curr_running_hours:{type: String,required: true},
    last_air_date:{type:String,required: true},
    last_oil_date:{type:String,required: true},
    fuelAmount:{type:String,required:false,default:0},
    fuelDate:{type:String,required:false,default:0},
    registrationNumber: { type: String, unique: true, required: true },
    Assigned_driver: { type: String, required: true },
    status: { type: String, enum: ["Available", "In Use", "Under Maintenance"], default: "Available" },
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;