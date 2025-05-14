import { Document } from "mongoose";
import { flightRoute } from "./flightRoute";
import { Seat } from "./seat";

export interface OperatingPeriod {
  startDate: Date;
  endDate: Date;
}

export interface Flight extends Document {
  flightNumber: string;
  departureDay: string;
  departureTime: string;
  operatingPeriod: OperatingPeriod;
  status: "Scheduled" | "Delayed" | "Cancelled" | "Completed";
  seats: Seat[];
  route: flightRoute;
  aircraft_id: string;
  totalSeats: number;
  seatMap: string[];
  basePrice: number;
  // Automatically calculated based on departureTime + route duration
  arrivalTime: string;
  isReturnFlightRequired: boolean;
  cancelledAt: Date | null;
}
