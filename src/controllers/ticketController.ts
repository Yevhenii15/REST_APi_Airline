import { Request, Response, NextFunction } from "express";
import { flightModel } from "../models/flightModel";
import { bookingModel } from "../models/bookingModel";
import { connect, disconnect } from "../database/database";

export async function getBookedSeats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await connect();
  try {
    const { flight_id, flight_date } = req.params;
    const flightDate = new Date(flight_date);

    if (isNaN(flightDate.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }

    const flight = await flightModel.findById(flight_id);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    const isWithinOperatingPeriod =
      flight.operatingPeriod.startDate <= flightDate &&
      flight.operatingPeriod.endDate >= flightDate;

    if (!isWithinOperatingPeriod) {
      res.status(400).json({ message: "Flight does not operate on this date" });
      return;
    }

    // Find bookings that are not canceled and filter by flight date and flight id
    const bookings = await bookingModel.find({
      bookingStatus: { $ne: "Cancelled" },
      "tickets.flight_id": flight_id,
      "tickets.departureDate": {
        $gte: new Date(flightDate.setHours(0, 0, 0, 0)), // Start of the day
        $lt: new Date(flightDate.setHours(23, 59, 59, 999)), // End of the day
      },
    });

    // Collect all booked seat numbers
    const seatNumbers = bookings
      .flatMap((booking) =>
        booking.tickets.filter(
          (ticket) =>
            ticket.flight_id === flight_id &&
            new Date(ticket.departureDate).toDateString() ===
              flightDate.toDateString()
        )
      )
      .map((ticket) => ticket.seatNumber);

    res.status(200).json({ bookedSeats: seatNumbers });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to fetch booked seats",
      error: err.message,
    });
  } finally {
    await disconnect();
  }
}
