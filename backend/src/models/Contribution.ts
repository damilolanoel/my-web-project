import mongoose, { Document, Schema } from 'mongoose';

export interface IContribution extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  month: string; // Format: YYYY-MM
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>({
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
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  dueDate: {
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

// Compound index to ensure one contribution per user per month
contributionSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model<IContribution>('Contribution', contributionSchema);