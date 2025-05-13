import { Schema, model } from "mongoose";
import { Ticket } from "../interfaces/ticket";

export const ticketSchema = new Schema<Ticket>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  gender: { type: String, required: true },
  seatNumber: { type: String, required: true },
  flight_id: { type: String, required: true },
  departureDate: { type: Date, required: true },

  // Check-in fields
  passportNumber: { type: String },
  dateOfBirth: { type: Date },
  nationality: { type: String },
  expirationDate: { type: Date },
  isCheckedIn: { type: Boolean, default: false },
  checkInTime: { type: Date },

  // New structured fields from frontend ticketData
  departureAirportName: { type: String },
  arrivalAirportName: { type: String },
  departureIATA: { type: String },
  arrivalIATA: { type: String },
  flightNumber: { type: String },
  flightStatus: { type: String },
  qrDataUrl: { type: String }, // base64 string
  departureTime: { type: String },
});

export const ticketModel = model<Ticket>("Ticket", ticketSchema);
