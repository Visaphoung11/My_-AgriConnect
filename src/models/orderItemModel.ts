import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0, // start from 0$
    },
  },
  { timestamps: true }
);

// Traditional separate table approach - order items in different collection
export default mongoose.model<IOrderItem>("OrderItem", orderItemSchema);
