// models/orderModel.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: {
    id?: string;
    status?: string;
    amount?: number;
    currency?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const orderModel: Model<IOrder> = mongoose.model('Order', orderSchema);
export default orderModel;