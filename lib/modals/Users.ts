import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  plan?: Types.ObjectId;
  planStartDate: Date;
  planEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  plan: { type: Schema.Types.ObjectId, ref: "Plan" }, // user's subscription plan
  planStartDate: { type: Date, default: Date.now },
  planEndDate: { type: Date }, // can calculate based on subscription type
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false },
});

userSchema.pre<IUser>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const User = (models.User as mongoose.Model<IUser>) || model<IUser>("User", userSchema);
