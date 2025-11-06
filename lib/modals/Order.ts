import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  bookPlanId: Types.ObjectId;
  luluOrderId?: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  price: number;
  shippingAddress?: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookPlanId: { type: Schema.Types.ObjectId, ref: "BookPlan", required: true },
  luluOrderId: { type: String },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered"], default: "pending" },
  price: { type: Number, required: true },
  shippingAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Order = (models.Order as mongoose.Model<IOrder>) || model<IOrder>("Order", orderSchema);
