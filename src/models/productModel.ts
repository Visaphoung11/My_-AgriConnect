import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  image: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    available: {
      type: Boolean,
      default: true
    },
    image: {
      type: [String],
      required: true,
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
