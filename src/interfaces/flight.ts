import { Document } from "mongoose";
import { flightRoute } from "./flightRoute";
import { Seat } from "./seat";

export interface OperatingPeriod {
  startDate: Date;
  endDate: Date;
}

export interface Flight extends Document {
  flightNumber: string; // Unique flight number (e.g., "LH123")
  departureDay: string; // Days flight operates (e.g., ["Monday", "Wednesday"])
  departureTime: string; // Departure time in "HH:mm" format
  operatingPeriod: OperatingPeriod; // Start & End dates of operation
  status: "Scheduled" | "Delayed" | "Cancelled" | "Completed"; // Flight status
  seats: Seat[]; // Array of seat objects
  route: flightRoute; // Embedded route details
  aircraft_id: string; // Associated aircraft ID
  totalSeats: number; // Total available seats
  seatMap: string[]; // Seat layout as an array
  basePrice: number; // Standard base price for the flight

  /** Automatically calculated based on departureTime + route duration */
  arrivalTime: string;
  isReturnFlightRequired: boolean; // Indicates if a return flight is needed
}
