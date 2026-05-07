import express from 'express';
import { body, validationResult } from 'express-validator';
import Payout from '../models/Payout';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// @desc    Get all payouts
// @route   GET /api/payouts
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let query = {};

    // Users can only see their own payouts unless they're admin
    if (req.user!.role !== 'admin') {
      query = { userId: req.user!._id };
    }

    // Filter by status, month, userId
    if (req.query.status) {
      query = { ...query, status: req.query.status };
    }
    if (req.query.month) {
      query = { ...query, month: req.query.month };
    }
    if (req.query.userId && req.user!.role === 'admin') {
      query = { ...query, userId: req.query.userId };
    }

    const payouts = await Payout.find(query)
      .populate('userId', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single payout
// @route   GET /api/payouts/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const payout = await Payout.findById(req.params.id)
      .populate('userId', 'username firstName lastName');

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    // Users can only view their own payouts unless they're admin
    if (req.user!.role !== 'admin' && payout.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this payout'
      });
    }

    res.json({
      success: true,
      data: payout
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create payout
// @route   POST /api/payouts
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('month').matches(/^\d{4}-\d{2}$/).withMessage('Month must be in YYYY-MM format'),
  body('payoutDate').isISO8601().withMessage('Valid payout date is required'),
  body('status').optional().isIn(['pending', 'paid', 'cancelled']).withMessage('Invalid status')
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

    const payout = await Payout.create(req.body);

    await payout.populate('userId', 'username firstName lastName');

    res.status(201).json({
      success: true,
      data: payout
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update payout
// @route   PUT /api/payouts/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('status').optional().isIn(['pending', 'paid', 'cancelled']).withMessage('Invalid status'),
  body('paidDate').optional().isISO8601().withMessage('Valid paid date is required'),
  body('paymentMethod').optional().isIn(['bank_transfer', 'card', 'cash', 'mobile_money']).withMessage('Invalid payment method'),
  body('transactionId').optional().isString().withMessage('Transaction ID must be a string'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const payout = await Payout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'username firstName lastName');

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    res.json({
      success: true,
      data: payout
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete payout
// @route   DELETE /api/payouts/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const payout = await Payout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    await Payout.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get payout statistics
// @route   GET /api/payouts/stats/summary
// @access  Private/Admin
router.get('/stats/summary', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalPayouts = await Payout.countDocuments();
    const paidPayouts = await Payout.countDocuments({ status: 'paid' });
    const pendingPayouts = await Payout.countDocuments({ status: 'pending' });
    const cancelledPayouts = await Payout.countDocuments({ status: 'cancelled' });

    const totalAmount = await Payout.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paidAmount = await Payout.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPayouts,
        paidPayouts,
        pendingPayouts,
        cancelledPayouts,
        totalAmount: totalAmount[0]?.total || 0,
        paidAmount: paidAmount[0]?.total || 0,
        pendingAmount: (totalAmount[0]?.total || 0) - (paidAmount[0]?.total || 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;