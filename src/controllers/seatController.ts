import { Request, Response } from "express";
import { connect, disconnect } from "../database/database";
import { flightModel } from "../models/flightModel";
import { ticketModel } from "../models/ticketModel";

export async function getSeatAvailability(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const { flightId } = req.params;

    // 1. Check if the flight exists
    const flight = await flightModel.findById(flightId);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    // 2. Use flight.totalSeats (default to 100 if not set)
    const totalSeats = flight.totalSeats || 100;
    const seatsPerRow = 6; // Adjust based on aircraft layout (e.g., 4, 6, 9 seats per row)
    const seatLabels = ["A", "B", "C", "D", "E", "F"]; // Columns per row

    // 3. Generate all possible seats (e.g., ["1A", "1B", ..., "17F"])
    const totalRows = Math.ceil(totalSeats / seatsPerRow);
    const allSeats = [];

    for (let row = 1; row <= totalRows; row++) {
      for (let seat of seatLabels) {
        allSeats.push(`${row}${seat}`);
      }
    }

    // 4. Get booked seats from ticketModel
    const bookedTickets = await ticketModel.find({ flight_id: flightId });
    const bookedSeats = bookedTickets.map((ticket) => ticket.seatNumber);

    // 5. Calculate available seats (all seats - booked seats)
    const availableSeats = allSeats.filter(
      (seat) => !bookedSeats.includes(seat)
    );

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
