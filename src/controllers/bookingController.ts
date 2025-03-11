import { Request, Response } from "express";
import { bookingModel } from "../models/bookingModel";
import { ticketModel } from "../models/ticketModel";
import { flightModel } from "../models/flightModel";
import { connect, disconnect } from "../database/database";

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

    // ✅ Check if the flight exists
    const flight = await flightModel.findById(flight_id);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    // ✅ Extract requested seat numbers
    const requestedSeats = tickets.map((ticket: any) => ticket.seatNumber);

    // ✅ Check if these seats are already booked in the `tickets` collection
    const bookedTickets = await ticketModel.find({
      flight_id: flight_id,
      seatNumber: { $in: requestedSeats },
    });

    if (bookedTickets.length > 0) {
      res.status(400).json({
        message: "Some seats are already booked",
        unavailableSeats: bookedTickets.map((t) => t.seatNumber),
      });
      return;
    }

    // ✅ If all seats are available, create the tickets
    const createdTickets = await Promise.all(
      tickets.map(async (ticket: any) => {
        const newTicket = new ticketModel(ticket);
        return await newTicket.save();
      })
    );

    // ✅ Create the booking entry
    const booking = new bookingModel({
      user_id,
      totalPrice,
      bookingDate: new Date(),
      numberOfTickets: tickets.length,
      bookingStatus: "Confirmed",
      tickets: createdTickets,
    });

    await booking.save();
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
