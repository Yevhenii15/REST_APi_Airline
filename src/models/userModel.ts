import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";

const userSchema = new Schema<User>({
  name: { type: String, required: true, min: 4, max: 255 },
  email: { type: String, required: true, min: 6, max: 255, unique: true },
  phone: { type: String, required: true, min: 6, max: 255, unique: true },
  password: { type: String, required: true, min: 6, max: 255 },
  dateOfBirth: { type: Date, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

export const userModel = model<User>("User", userSchema);
