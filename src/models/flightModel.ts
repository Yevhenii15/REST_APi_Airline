import { Schema, model } from "mongoose";
import { Flight } from "../interfaces/flight";
import { routeSchema } from "./routeModel";

const flightSchema = new Schema<Flight>({
  flightNumber: { type: String, required: true, min: 4, max: 50 },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  status: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  route: { type: routeSchema, required: true },
  aircraft_id: { type: String, required: true, min: 4, max: 50 },
});

export const flightModel = model<Flight>("Flight", flightSchema);
