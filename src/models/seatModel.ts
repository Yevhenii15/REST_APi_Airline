import { Schema, model } from "mongoose";
import { Seat } from "../interfaces/seat";

export const seatSchema = new Schema({
  seatNumber: { type: String, required: true },
  status: { type: String, enum: ["available", "booked"], default: "available" },
});

export const seatModel = model<Seat>("Seat", seatSchema);
