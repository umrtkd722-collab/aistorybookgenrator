import { Types } from "mongoose";

export interface User  {
  user: {

      
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  plan?: {
    name:string
  }
  planStartDate: Date;
  planEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
}
}