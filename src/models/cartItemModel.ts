import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem extends Document {
  cartId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    cartId: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

// This will create separate cartItem collection like traditional database
export default mongoose.model<ICartItem>('CartItem', cartItemSchema);
