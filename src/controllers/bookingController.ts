import { Request, Response } from "express";
import { bookingModel } from "../models/bookingModel";
import { ticketModel } from "../models/ticketModel";
import { flightModel } from "../models/flightModel";
import { connect, disconnect } from "../database/database";

async function getFlightById(flight_id: string) {
  return await flightModel.findById(flight_id);
}

async function getUnavailableSeats(flight_id: string, seatNumbers: string[]) {
  const bookedTickets = await ticketModel.find({
    flight_id,
    seatNumber: { $in: seatNumbers },
  });
  return bookedTickets.map((ticket) => ticket.seatNumber);
}

async function createTickets(tickets: any[]) {
  return await Promise.all(
    tickets.map(async (ticket) => {
      const newTicket = new ticketModel(ticket);
      return await newTicket.save();
    })
  );
}

async function createBookingRecord(
  user_id: string,
  totalPrice: number,
  tickets: any[]
) {
  const booking = new bookingModel({
    user_id,
    totalPrice,
    bookingDate: new Date(),
    numberOfTickets: tickets.length,
    bookingStatus: "Confirmed",
    tickets,
  });
  return await booking.save();
}

export async function createBooking(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const { user_id, tickets, totalPrice } = req.body;
    if (!tickets || tickets.length === 0) {
      res.status(400).json({ message: "No tickets provided" });
      return;
    }

    const flight_id = tickets[0].flight_id;

    // Validate flight
    const flight = await getFlightById(flight_id);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    // Check seat availability
    const requestedSeats = tickets.map((ticket: any) => ticket.seatNumber);
    const unavailableSeats = await getUnavailableSeats(
      flight_id,
      requestedSeats
    );
    if (unavailableSeats.length > 0) {
      res.status(400).json({
        message: "Some seats are already booked",
        unavailableSeats,
      });
      return;
    }

    // Create tickets
    const createdTickets = await createTickets(tickets);

    // Create booking
    const booking = await createBookingRecord(
      user_id,
      totalPrice,
      createdTickets
    );

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err });
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
