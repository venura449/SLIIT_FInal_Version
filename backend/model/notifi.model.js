import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a 'User' model
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,  // Automatically set to current timestamp
    },
    notificationType: {
        type: String,  // e.g., 'system', 'sale', 'alert', etc.
        default: 'system',
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
