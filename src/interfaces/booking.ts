export interface Booking extends Document {
  booking_id: string;
  totalPrice: number;
  bookingDate: Date;
  numberOfTickets: number;
  bookingStatus: string;
  user_id: number;
  payment_id: number;
}
