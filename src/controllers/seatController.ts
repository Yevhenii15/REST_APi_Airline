import { Request, Response } from "express";
import { connect, disconnect } from "../database/database";
import { ticketModel } from "../models/ticketModel";
import { getFlightById } from "./flightController";

/**
 * Generate all possible seats based on aircraft layout
 */
function generateSeatLayout(totalSeats: number, seatsPerRow: number): string[] {
  const seatLabels = ["A", "B", "C", "D", "E", "F"]; // Column labels
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  const allSeats: string[] = [];

  for (let row = 1; row <= totalRows; row++) {
    for (let seat of seatLabels) {
      allSeats.push(`${row}${seat}`);
    }
  }

  return allSeats;
}

/**
 * Fetch booked seats for a specific flight
 */
async function getBookedSeats(flightId: string): Promise<string[]> {
  const bookedTickets = await ticketModel.find({ flight_id: flightId });
  return bookedTickets.map((ticket) => ticket.seatNumber);
}

/**
 * Get available seats by filtering out booked seats
 */
function getAvailableSeats(
  allSeats: string[],
  bookedSeats: string[]
): string[] {
  return allSeats.filter((seat) => !bookedSeats.includes(seat));
}

/**
 * Main function to get seat availability
 */
export async function getSeatAvailability(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const { flightId } = req.params;

    // Fetch flight details
    const flight = await getFlightById(flightId);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    const totalSeats = flight.totalSeats || 100;
    const seatsPerRow = 6; // Modify based on aircraft

    // Generate seat layout
    const allSeats = generateSeatLayout(totalSeats, seatsPerRow);

    // Fetch booked seats
    const bookedSeats = await getBookedSeats(flightId);

    // Get available seats
    const availableSeats = getAvailableSeats(allSeats, bookedSeats);

    res.status(200).json({
      flightId,
      totalSeats,
      bookedSeats,
      availableSeats,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching seat availability", error });
  } finally {
    await disconnect();
  }
}
