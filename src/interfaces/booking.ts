import { User } from "./user";

export interface Booking extends Document {
  booking_id: string;
  totalPrice: number;
  bookingDate: Date;
  numberOfTickets: number;
  bookingStatus: string;
  user_id: User["user_id"];
  payment_id: number;
}
