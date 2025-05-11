import { Flight } from "./flight";
import { Seat } from "./seat";
import { Luggage } from "./luggage";

export interface Ticket extends Document {
  ticket_id: string;
  firstName: string;
  lastName: string;
  ticketPrice: number;
  gender: string;
  luggage: Luggage;
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
}
