import { Route } from "./route";
export interface Flight extends Document {
  flight_id: string;
  flightNumber: string;
  departureTime: Date;
  arrivalTime: Date;
  status: string;
  seatsAvailable: number;
  route: Route;
  aircraft_id: string;
}
