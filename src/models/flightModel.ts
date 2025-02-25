import { Schema, model } from 'mongoose';
import { Flight } from '../interfaces/flight';

const flightSchema = new Schema<Flight>({
    flight_id: { type: String, required: true},
    flightNumber: { type: Number, required: true, min : 4, max: 50 },
    departureAirport_id: { type: String, ref:"Airport", required: true},
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true }
})

export const flightModel = model<Flight>('Flight', flightSchema);