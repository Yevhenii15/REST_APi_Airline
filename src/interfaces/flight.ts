import { flightRoute } from "./flightRoute";
import { Seat } from "./seat";
export interface Flight extends Document {
  flight_id: string;
  flightNumber: string;
  departureTime: Date;
  arrivalTime: Date;
  status: string;
  seats: Seat[];
  route: flightRoute;
  aircraft_id: string;
  totalSeats: number;
}
