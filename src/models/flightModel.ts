import { Schema, model } from "mongoose";
import { Flight } from "../interfaces/flight";
import { routeSchema } from "./routeModel";
import { seatSchema } from "./seatModel";

const flightSchema = new Schema<Flight>({
  flightNumber: { type: String, required: true, min: 4, max: 50 },
  departureDay: { type: String, required: true }, // Days flight operates (e.g., ["Monday", "Wednesday"])
  departureTime: { type: String, required: true }, // HH:mm format
  arrivalTime: { type: String }, // HH:mm format
  operatingPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  status: { type: String, required: true },
  seats: [seatSchema],
  route: { type: routeSchema, required: true },
  aircraft_id: { type: String, required: true, min: 4, max: 50 },
  totalSeats: { type: Number, default: 192 },
  seatMap: { type: [String], required: true },
  basePrice: { type: Number, required: true },
  isReturnFlightRequired: { type: Boolean, default: false }, // New field
});

export const flightModel = model<Flight>("Flight", flightSchema);
