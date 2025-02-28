import { Ticket } from "./ticket";

export interface CheckIn extends Document {
  checkin_id: string;
  ticket: Ticket["ticket_id"];
  passenger: {
    passportNumber: string;
    nationality: string;
    dateOfBirth: Date;
    expirationDate: Date;
  };
  status: string;
  checkinTime: Date;
  boardingPassUrl: string;
}
