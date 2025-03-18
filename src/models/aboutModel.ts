import { Schema, model } from "mongoose";
import { AboutCompany } from "../interfaces/aboutCompany"

const airportSchema = new Schema<AboutCompany>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

export const aboutModel = model<AboutCompany>("AboutCompany", airportSchema);
