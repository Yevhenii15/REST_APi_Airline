import { User } from "./user";
import { Ticket } from "./ticket";
import { Payment } from "./payment";

export interface Booking extends Document {
  booking_id: string;
  totalPrice: number;
  bookingDate: Date;
  numberOfTickets: number;
  bookingStatus: string;
  tickets: Ticket[];
  payment: Payment;
  user_id: User["_id"];
}
