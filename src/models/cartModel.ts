import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);


export default mongoose.model<ICart>('Cart', cartSchema);
