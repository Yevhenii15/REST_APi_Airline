export interface Ticket extends Document {
    ticket_id: number;
    firstName: string;
    lastName: string;
    ticketPrice: number;
    gender: string;
    booking_id: number;
    flight_id: number;
    seat_id: number;
    lagguge_id: number;
}
