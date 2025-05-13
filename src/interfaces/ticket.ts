import { Flight } from "./flight";
import { Seat } from "./seat";

export interface Ticket extends Document {
  ticket_id: string;
  firstName: string;
  lastName: string;
  ticketPrice: number;
  gender: string;
  seatNumber: Seat["seatNumber"];
  flight_id: Flight["_id"];
  departureDate: Date;

  // Check-in fields
  passportNumber: string;
  dateOfBirth: Date;
  nationality: string;
  expirationDate: Date;
  isCheckedIn: boolean;
  checkInTime: Date;

  departureAirportName: string;
  arrivalAirportName: string;
  departureIATA: string;
  arrivalIATA: string;
  flightNumber: string;
  flightStatus: string;
  departureTime: string;
  qrDataUrl: string;
}
