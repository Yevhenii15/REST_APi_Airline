import { Schema, model } from "mongoose";
import { Airport } from "../interfaces/airport"; // Import the interface

const airportSchema = new Schema<Airport>({
  name: { type: String, required: true },
  airportCode: { type: String, required: true },
  cityName: { type: String, required: true },
  countryCode: { type: String, required: true },
});

export const airportModel = model<Airport>("Airport", airportSchema);
