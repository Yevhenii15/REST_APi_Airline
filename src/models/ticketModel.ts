import { Schema, model } from "mongoose";
import { Ticket } from "../interfaces/ticket";

const ticketSchema = new Schema<Ticket>({
  firstName: { type: String, required: true, min: 4, max: 50 },
  lastName: { type: String, required: true, min: 4, max: 50 },
  ticketPrice: { type: Number, required: true },
  gender: { type: String, required: true, min: 4, max: 50 },
  seat_id: { type: String, required: true },
  lagguge_id: { type: String, required: true },
  booking_id: { type: String, ref: "Booking", required: true },
  flight_id: { type: String, ref: "Flight", required: true },
});

export const ticketModel = model<Ticket>("Ticket", ticketSchema);
