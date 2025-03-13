import express from 'express';
import Notification from '../model/notifi.model.js';  // Make sure the path is correct

const router = express.Router();

// 1. Create a new notification
router.post('/notifications', async (req, res) => {
    try {
        const { userId, message, notificationType } = req.body;

        const newNotification = new Notification({
            userId,
            message,
            notificationType,
        });

        await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully!', notification: newNotification });
    } catch (err) {
        res.status(400).json({ message: 'Error creating notification', error: err });
    }
});

// 2. Get all notifications for a specific user
router.get('/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({ userId });

        if (!notifications) {
            return res.status(404).json({ message: 'No notifications found for this user.' });
        }

        res.status(200).json(notifications);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching notifications', error: err });
    }
});

// 3. Mark notification as read (update)
router.put('/notifications/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { isRead } = req.body;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json({ message: 'Notification updated successfully', notification: updatedNotification });
    } catch (err) {
        res.status(400).json({ message: 'Error updating notification', error: err });
    }
});

// 4. Delete a notification
router.delete('/notifications/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;

        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting notification', error: err });
    }
});

export default router;
