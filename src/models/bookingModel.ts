import { Schema, model } from "mongoose";
import { Booking } from "../interfaces/booking";
import { ticketSchema } from "./ticketModel";

const bookingSchema = new Schema<Booking>({
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  numberOfTickets: { type: Number, required: true },
  bookingStatus: {
    type: String,
    enum: ["Confirmed", "Cancelled"],
    default: "Confirmed",
  },
  tickets: [ticketSchema],
  user_id: { type: String, required: true },
  user_email: { type: String, required: true },
});

export const bookingModel = model<Booking>("Booking", bookingSchema);
