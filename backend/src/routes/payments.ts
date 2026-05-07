import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import Contribution from '../models/Contribution';
import Notification from '../models/Notification';
import { protect } from '../middleware/auth';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, [
  body('contributionId').isMongoId().withMessage('Valid contribution ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01')
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

    const { contributionId, amount } = req.body;

    // Verify contribution exists and belongs to user
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        error: 'Contribution not found'
      });
    }

    if (contribution.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to pay for this contribution'
      });
    }

    if (contribution.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Contribution is already paid'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        contributionId: contributionId,
        userId: req.user!._id.toString()
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('contributionId').isMongoId().withMessage('Valid contribution ID is required')
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

    const { paymentIntentId, contributionId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Payment was not successful'
      });
    }

    // Update contribution
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        error: 'Contribution not found'
      });
    }

    contribution.status = 'paid';
    contribution.paidDate = new Date();
    contribution.transactionId = paymentIntentId;
    contribution.paymentMethod = 'card';
    await contribution.save();

    // Create success notification
    await Notification.create({
      userId: req.user!._id,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Your payment of $${contribution.amount} for ${contribution.month} has been processed successfully.`,
      metadata: {
        contributionId: contribution._id,
        amount: contribution.amount,
        month: contribution.month
      }
    });

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        contribution: contribution
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res, next) => {
  try {
    const contributions = await Contribution.find({
      userId: req.user!._id,
      status: 'paid',
      transactionId: { $exists: true }
    }).sort({ paidDate: -1 });

    res.json({
      success: true,
      count: contributions.length,
      data: contributions
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful!', paymentIntent.id);

      // Update contribution status if metadata contains contributionId
      if (paymentIntent.metadata.contributionId) {
        try {
          const contribution = await Contribution.findById(paymentIntent.metadata.contributionId);
          if (contribution && contribution.status !== 'paid') {
            contribution.status = 'paid';
            contribution.paidDate = new Date();
            contribution.transactionId = paymentIntent.id;
            contribution.paymentMethod = 'card';
            await contribution.save();

            // Create notification
            await Notification.create({
              userId: contribution.userId,
              type: 'payment_success',
              title: 'Payment Successful',
              message: `Your payment of $${contribution.amount} for ${contribution.month} has been processed successfully.`,
              metadata: {
                contributionId: contribution._id,
                amount: contribution.amount,
                month: contribution.month
              }
            });
          }
        } catch (error) {
          console.error('Error updating contribution from webhook:', error);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed!', failedPayment.id);
      // Handle failed payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;