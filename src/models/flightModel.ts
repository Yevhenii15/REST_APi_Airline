import { Schema, model } from "mongoose";
import { Flight } from "../interfaces/flight";

const flightSchema = new Schema<Flight>({
  flightNumber: { type: String, required: true, min: 4, max: 50 },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  status: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  depatureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  aircraft_id: { type: String, required: true, min: 4, max: 50 },
  arrivalAirport_id: { type: String, ref: "Airport", required: true },
  departureAirport_id: { type: String, ref: "Airport", required: true },
});

export const flightModel = model<Flight>("Flight", flightSchema);
