import { Schema, model } from "mongoose";
import { Ticket } from "../interfaces/ticket";

export const ticketSchema = new Schema<Ticket>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  gender: { type: String, required: true },
  /* luggage: { type: Object, required: true }, */
  seat: { type: Object, required: true },
  flight_id: { type: String, required: true },
});

export const ticketModel = model<Ticket>("Ticket", ticketSchema);
