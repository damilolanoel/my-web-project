import mongoose, { Document, Schema } from 'mongoose';

export interface IPayout extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  month: string; // Format: YYYY-MM
  status: 'pending' | 'paid' | 'cancelled';
  payoutDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const payoutSchema = new Schema<IPayout>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  payoutDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'card', 'cash', 'mobile_money']
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index to ensure one payout per user per month
payoutSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model<IPayout>('Payout', payoutSchema);