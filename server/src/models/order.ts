import { Schema, model } from 'mongoose';

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    items: { type: Array, default: [] },
    total: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.Pending }
  },
  { timestamps: true }
);

export const Order = model('Order', OrderSchema);
