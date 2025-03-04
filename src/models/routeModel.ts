import { Schema, model } from "mongoose";
import { Route } from "../interfaces/flightRoute";

const routeSchema = new Schema<Route>({
    departureAirport_id: { type: String, required: true },
    arrivalAirport_id: { type: String, required: true },
    duration: { type: String, required: true },
}); 

export const routeModel = model<Route>("Route", routeSchema);