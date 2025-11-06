import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IPlan extends Document {
  name: string;
  price: number;
  pageLimit: number;
  photoLimit: number;
  booksPerMonth: number;
  templates: string[];
  supportLevel: string;
  printDiscount: number;
  deliveryDays: string;
  addOns: string[];
  createdAt: Date;
  updateAt:Date
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true }, // Starter, Pro, Unlimited
  price: { type: Number, required: true }, // Base price
  pageLimit: { type: Number, default: 0 }, // 0 = unlimited
  photoLimit: { type: Number, default: 0 }, // 0 = unlimited
  booksPerMonth: { type: Number, default: 0 }, // 0 = unlimited
  templates: { type: [String], default: [] }, // e.g. ["family", "journal"]
  supportLevel: { type: String, default: "standard" }, // standard / priority / dedicated
  printDiscount: { type: Number, default: 0 }, // % discount for extra books
  deliveryDays: { type: String, default: "1-3" }, // UK delivery
  addOns: { type: [String], default: [] }, // ["premium cover", "AI artwork", etc.]
  createdAt: { type: Date, default: Date.now },
  updatedAt : {type:Date, default:Date.now}
});

export const Plan = (models.Plan as mongoose.Model<IPlan>) || model<IPlan>("Plan", planSchema);
