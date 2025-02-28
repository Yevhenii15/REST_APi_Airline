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
  seat: Seat;
  flight_id: Flight["flight_id"];
}
