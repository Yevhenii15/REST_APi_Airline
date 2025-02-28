export interface Seat extends Document {
  seat_id: string;
  row: number;
  seatLetter: string;
  status: string;
}
