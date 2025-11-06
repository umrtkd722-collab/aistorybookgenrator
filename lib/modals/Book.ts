import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IBookPlan extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  title: string;
  description?: string;
  type: "relationship" | "gift" | "other";
  storyIds: Types.ObjectId[];
  coverUrl?: string;
  pdfFileId?: Types.ObjectId;
  createdAt: Date;
}

const bookPlanSchema = new Schema<IBookPlan>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true }, // user plan
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["relationship", "gift", "other"], default: "other" },
  storyIds: [{ type: Schema.Types.ObjectId, ref: "Story" }],
  coverUrl: { type: String },
  pdfFileId: { type: Schema.Types.ObjectId }, // GridFS
  createdAt: { type: Date, default: Date.now },
});

export const BookPlan = (models.BookPlan as mongoose.Model<IBookPlan>) || model<IBookPlan>("BookPlan", bookPlanSchema);
