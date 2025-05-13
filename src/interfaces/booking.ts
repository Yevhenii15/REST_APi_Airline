import { User } from "./user";
import { Ticket } from "./ticket";

export interface Booking extends Document {
  booking_id: string;
  totalPrice: number;
  bookingDate: Date;
  numberOfTickets: number;
  bookingStatus: string;
  tickets: Ticket[];
  user_id: User["_id"];
  user_email: User["email"];
}
