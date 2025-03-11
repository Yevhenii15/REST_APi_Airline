import { Request, Response } from "express";
import { bookingModel } from "../models/bookingModel";
import { ticketModel } from "../models/ticketModel";
import { getFlightById } from "./flightController";
import { connect, disconnect } from "../database/database";

/**
 * Generates a valid seat map.
 */
export function generateSeatMap(): Set<string> {
  const rows = Array.from({ length: 32 }, (_, i) => (i + 1).toString());
  const columns = ["A", "B", "C", "D", "E", "F"];
  return new Set(rows.flatMap((row) => columns.map((col) => `${row}${col}`)));
}

/**
 * Validates flight existence.
 */
async function validateFlight(flight_id: string): Promise<void> {
  if (!(await getFlightById(flight_id))) {
    throw { status: 404, message: "Flight not found" };
  }
}

/**
 * Validates seat numbers.
 */
function validateSeats(requestedSeats: string[]): void {
  const seatMap = generateSeatMap();
  const invalidSeats = requestedSeats.filter((seat) => !seatMap.has(seat));
  if (invalidSeats.length) {
    throw { status: 400, message: "Invalid seat numbers", invalidSeats };
  }
}

/**
 * Checks seat availability.
 */
async function checkSeatAvailability(
  flight_id: string,
  requestedSeats: string[]
): Promise<void> {
  const bookedSeats = await ticketModel.find({
    flight_id,
    seatNumber: { $in: requestedSeats },
  });

  if (bookedSeats.length) {
    throw {
      status: 400,
      message: "Some seats are already booked",
      bookedSeats: bookedSeats.map((t) => t.seatNumber),
    };
  }
}

/**
 * Creates booking and tickets in a transaction.
 */
async function createBookingTransaction(
  user_id: string,
  totalPrice: number,
  tickets: any[]
): Promise<any> {
  const createdTickets = await ticketModel.insertMany(tickets);
  return bookingModel.create({
    user_id,
    totalPrice,
    bookingDate: new Date(),
    numberOfTickets: createdTickets.length,
    bookingStatus: "Confirmed",
    tickets: createdTickets,
  });
}

/**
 * Handles the booking process.
 */
export async function createBooking(
  req: Request,
  res: Response
): Promise<void> {
  await connect();
  try {
    const { user_id, tickets, totalPrice } = req.body;
    if (!tickets?.length) throw { status: 400, message: "No tickets provided" };

    const flight_id = tickets[0].flight_id;
    await validateFlight(flight_id);

    const requestedSeats = tickets.map((t: any) => t.seatNumber);
    validateSeats(requestedSeats);
    await checkSeatAvailability(flight_id, requestedSeats);

    const booking = await createBookingTransaction(
      user_id,
      totalPrice,
      tickets
    );
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message, ...err });
  } finally {
    await disconnect();
  }
}

// Get all bookings
export async function getAllBookings(req: Request, res: Response) {
  try {
    await connect();
    const bookings = await bookingModel.find().populate("tickets");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err });
  } finally {
    await disconnect();
  }
}

// Get user bookings
export async function getUserBookings(req: Request, res: Response) {
  try {
    await connect();
    const userId = req.params.id;
    const bookings = await bookingModel
      .find({ user_id: userId })
      .populate("tickets");
    res.status(200).json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user bookings", error: err });
  } finally {
    await disconnect();
  }
}

// Get specific booking
export async function getBookingById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("tickets");

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return; // Ensure function execution stops
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking", error: err });
  } finally {
    await disconnect();
  }
}

// Cancel Booking
export async function cancelBooking(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();
    const booking = await bookingModel.findByIdAndDelete(req.params.id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return; // Ensure function execution stops
    }

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error canceling booking", error: err });
  } finally {
    await disconnect();
  }
}
