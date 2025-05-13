import { Request, Response, NextFunction } from "express";
import { flightModel } from "../models/flightModel";
import { bookingModel } from "../models/bookingModel";
import { ticketModel } from "../models/ticketModel";
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
// Update ticket with check-in information
export async function updateTicket(req: Request, res: Response): Promise<void> {
  await connect();
  try {
    const { ticketId } = req.params;
    const {
      passportNumber,
      dateOfBirth,
      nationality,
      expirationDate,
      isCheckedIn,
      checkInTime,
      ticketData, // structured object from frontend
    } = req.body;

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    // Update check-in fields
    ticket.passportNumber = passportNumber || ticket.passportNumber;
    ticket.dateOfBirth = dateOfBirth || ticket.dateOfBirth;
    ticket.nationality = nationality || ticket.nationality;
    ticket.expirationDate = expirationDate || ticket.expirationDate;
    ticket.isCheckedIn =
      isCheckedIn !== undefined ? isCheckedIn : ticket.isCheckedIn;
    ticket.checkInTime = checkInTime || ticket.checkInTime;

    // Update structured ticket data
    if (ticketData) {
      ticket.departureAirportName =
        ticketData.departureAirportName || ticket.departureAirportName;
      ticket.arrivalAirportName =
        ticketData.arrivalAirportName || ticket.arrivalAirportName;
      ticket.departureIATA = ticketData.departureIATA || ticket.departureIATA;
      ticket.arrivalIATA = ticketData.arrivalIATA || ticket.arrivalIATA;
      ticket.flightNumber = ticketData.flightNumber || ticket.flightNumber;
      ticket.flightStatus = ticketData.flightStatus || ticket.flightStatus;
      ticket.departureTime = ticketData.departureTime || ticket.departureTime;
      ticket.qrDataUrl = ticketData.qrDataUrl || ticket.qrDataUrl;
    }

    const updatedTicket = await ticket.save();

    // Optional: update embedded booking.tickets if needed
    const booking = await bookingModel.findOne({ "tickets._id": ticketId });
    if (booking) {
      const ticketIndex = booking.tickets.findIndex(
        (t: any) => t._id.toString() === ticketId
      );
      if (ticketIndex !== -1) {
        Object.assign(booking.tickets[ticketIndex], {
          departureAirportName: ticket.departureAirportName,
          arrivalAirportName: ticket.arrivalAirportName,
          departureIATA: ticket.departureIATA,
          arrivalIATA: ticket.arrivalIATA,
          flightNumber: ticket.flightNumber,
          flightStatus: ticket.flightStatus,
          departureTime: ticket.departureTime,
          qrDataUrl: ticket.qrDataUrl,
        });
        await booking.save();
      }
    }

    res.status(200).json(updatedTicket);
  } catch (err: any) {
    res.status(500).json({ message: "Error updating ticket", error: err });
  } finally {
    await disconnect();
  }
}

// Fetch tickets by user
export async function getTicketsByUser(
  req: Request,
  res: Response
): Promise<void> {
  await connect();
  try {
    const userId = req.params.userId; // Get userId from request params

    // Find all bookings by user_id (assuming the booking collection has user_id)
    const bookings = await bookingModel.find({ user_id: userId });

    if (!bookings || bookings.length === 0) {
      res.status(404).json({ message: "No bookings found for this user" });
      return;
    }

    // Extract all tickets from the bookings
    const allTickets = bookings.flatMap((booking) => booking.tickets);

    if (allTickets.length === 0) {
      res.status(404).json({ message: "No tickets found for this user" });
      return;
    }

    // Return the found tickets
    res.status(200).json(allTickets);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching tickets", error: err });
  } finally {
    await disconnect();
  }
}
