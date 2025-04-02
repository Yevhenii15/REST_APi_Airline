import { Schema, model } from "mongoose";
import { Flight } from "../interfaces/flight";
import { routeSchema } from "./routeModel";
import { seatSchema } from "./seatModel";

const flightSchema = new Schema<Flight>({
  flightNumber: { type: String, required: true, min: 4, max: 50 },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date },
  status: { type: String, required: true },
  seats: [seatSchema],
  route: { type: routeSchema, required: true },
  aircraft_id: { type: String, required: true, min: 4, max: 50 },
  totalSeats: { type: Number, default: 192 },
  seatMap: { type: [String], required: true }, // Add seatMap as an array of seat numbers
  basePrice: { type: Number, required: true }, // New field for flight base price
});

export const flightModel = model<Flight>("Flight", flightSchema);
