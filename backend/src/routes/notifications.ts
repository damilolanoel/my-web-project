import express from 'express';
import { body, validationResult } from 'express-validator';
import Notification from '../models/Notification';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let query: any = { userId: req.user!._id };

    // Filter by read status
    if (req.query.read !== undefined) {
      query.read = req.query.read === 'true';
    }

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    // Users can only view their own notifications
    if (notification.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this notification'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('type').isIn(['payment_reminder', 'overdue_alert', 'payment_success', 'payout_notification', 'system_alert']).withMessage('Invalid notification type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('actionUrl').optional().isURL().withMessage('Action URL must be a valid URL')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    // Users can only mark their own notifications as read
    if (notification.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this notification'
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user!._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    // Users can only delete their own notifications
    if (notification.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const totalNotifications = await Notification.countDocuments({ userId: req.user!._id });
    const unreadNotifications = await Notification.countDocuments({ userId: req.user!._id, read: false });
    const readNotifications = totalNotifications - unreadNotifications;

    // Get counts by type
    const typeStats = await Notification.aggregate([
      { $match: { userId: req.user!._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        byType: typeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;