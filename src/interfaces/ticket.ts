import { Booking } from "./booking";
import { Flight } from "./flight";
export interface Ticket extends Document {
  ticket_id: number;
  firstName: string;
  lastName: string;
  ticketPrice: number;
  gender: string;
  booking_id: Booking["booking_id"];
  flight_id: Flight["flight_id"];
  seat_id: number;
  lagguge_id: number;
}
