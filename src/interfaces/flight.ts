import { Airport } from "./airport";
export interface Flight extends Document {
  flight_id: number;
  flightNumber: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: string;
  seatsAvailable: number;
  depatureDate: Date;
  arrivalDate: Date;
  departureAirport_id: Airport["airport_id"];
  arrivalAirport_id: Airport["airport_id"];
  aircraft_id: number;
}
