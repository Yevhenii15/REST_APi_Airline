import { Request, Response, NextFunction } from "express";
import { ticketModel } from "../models/ticketModel";
import { flightModel } from "../models/flightModel";
import { connect, disconnect } from "../database/database";

export async function getBookedSeats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await connect();
  try {
    const { flight_id, flight_date } = req.params; // Get flight_id and flight_date from URL parameters
    const flightDate = new Date(flight_date); // Convert the flight_date to a Date object

    // Validate the date
    if (isNaN(flightDate.getTime())) {
      res.status(400).json({ message: "Invalid date format" }); // Send error response
      return;
    }

    // Fetch the flight data to ensure the date is within the operating period
    const flight = await flightModel.findById(flight_id);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" }); // Send error response
      return;
    }

    // Check if the flight's operating period includes the provided flight_date
    const isWithinOperatingPeriod =
      flight.operatingPeriod.startDate <= flightDate &&
      flight.operatingPeriod.endDate >= flightDate;

    if (!isWithinOperatingPeriod) {
      res.status(400).json({ message: "Flight does not operate on this date" }); // Send error response
      return;
    }

    // Find all tickets for the given flight_id and departureDate
    const tickets = await ticketModel.find({
      flight_id,
      departureDate: {
        $gte: new Date(flightDate.setHours(0, 0, 0, 0)), // Start of the day
        $lt: new Date(flightDate.setHours(23, 59, 59, 999)), // End of the day
      },
    });

    const seatNumbers = tickets.map((ticket) => ticket.seatNumber);
    res.status(200).json({ bookedSeats: seatNumbers }); // Send response without return
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch booked seats", error: err.message }); // Send error response
  } finally {
    await disconnect();
  }
}
