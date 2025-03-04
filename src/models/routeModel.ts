import { Schema, model } from "mongoose";
import { flightRoute } from "../interfaces/flightRoute";

const routeSchema = new Schema<flightRoute>({
    departureAirport_id: { type: String, required: true },
    arrivalAirport_id: { type: String, required: true },
    duration: { type: String, required: true },
}); 

export const routeModel = model<flightRoute>("flightRoute", routeSchema);