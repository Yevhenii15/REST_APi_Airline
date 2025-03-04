import { flightRoute } from "./flightRoute";
export interface Flight extends Document {
  flight_id: string;
  flightNumber: string;
  departureTime: Date;
  arrivalTime: Date;
  status: string;
  seatsAvailable: number;
  route: flightRoute;
  aircraft_id: string;
}
