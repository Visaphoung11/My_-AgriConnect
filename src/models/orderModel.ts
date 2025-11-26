import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Traditional approach - order items are in separate collection linked by orderId
export default mongoose.model<IOrder>('Order', orderSchema);
