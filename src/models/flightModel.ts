import { Schema, model } from "mongoose";
import { Flight } from "../interfaces/flight";
import { routeSchema } from "./routeModel";
import { seatSchema } from "./seatModel";

const flightSchema = new Schema<Flight>({
  flightNumber: { type: String, required: true, min: 4, max: 50 },
  departureDay: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String },
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
  isReturnFlightRequired: { type: Boolean, default: false },

  // ✅ Add this field for automatic deletion
  cancelledAt: { type: Date, default: null },
});

// ✅ TTL index: delete 30 days (2592000 seconds) after cancellation
flightSchema.index(
  { cancelledAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
); // 30 days

export const flightModel = model<Flight>("Flight", flightSchema);
