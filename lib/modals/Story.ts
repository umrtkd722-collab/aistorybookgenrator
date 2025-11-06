import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IStory extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  title: string;
  prompt: string;
  storyText: string;
  coverUrl?: string;
  pdfFileId?: Types.ObjectId;
  createdAt: Date;
}

const storySchema = new Schema<IStory>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true }, // track which plan this story was created under
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  storyText: { type: String, required: true },
  coverUrl: { type: String },
  pdfFileId: { type: Schema.Types.ObjectId }, // GridFS reference
  createdAt: { type: Date, default: Date.now },
});

export const Story = (models.Story as mongoose.Model<IStory>) || model<IStory>("Story", storySchema);
