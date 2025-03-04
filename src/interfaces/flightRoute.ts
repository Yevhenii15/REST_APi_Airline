export interface Route extends Document {
  route_id: string;
  departureAirport_id: string;
  arrivalAirport_id: string;
  duration: string;
}
