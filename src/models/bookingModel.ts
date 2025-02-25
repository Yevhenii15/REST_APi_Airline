import { Schema, model } from "mongoose";
import { Booking } from "../interfaces/booking";

const bookingSchema = new Schema<Booking>({
  booking_id: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, required: true },
  numberOfTickets: { type: Number, required: true },
  bookingStatus: { type: String, required: true },
  user_id: { type: String, ref: "User", required: true },
  payment_id: { type: String, required: true },
});

export const bookingModel = model<Booking>("Booking", bookingSchema);
