import { Schema, model } from "mongoose";
import { Airport } from "../interfaces/airport";

const airportSchema = new Schema<Airport>({
  name: { type: String, required: true, min: 4, max: 50 },
  airportCode: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true, min: 4, max: 50 },
  country: { type: String, required: true, min: 4, max: 50 },
});

export const airportModel = model<Airport>("Airport", airportSchema);
