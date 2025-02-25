import { Booking } from "./booking";
import { Flight } from "./flight";
export interface Ticket extends Document {
  ticket_id: string;
  firstName: string;
  lastName: string;
  ticketPrice: number;
  gender: string;
  seat_id: string;
  lagguge_id: string;
  booking_id: Booking["booking_id"];
  flight_id: Flight["flight_id"];
}
