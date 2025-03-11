import { Request, Response } from "express";
import { bookingModel } from "../models/bookingModel";
import { ticketModel } from "../models/ticketModel";
import { connect, disconnect } from "../database/database";

// Create booking
export async function createBooking(req: Request, res: Response) {
  try {
    await connect();
    const { user_id, tickets, totalPrice } = req.body;

    // Create tickets and save them to the database
    const createdTickets = await Promise.all(
      tickets.map(async (ticket: any) => {
        const newTicket = new ticketModel(ticket);
        return await newTicket.save(); // Save each ticket and return the result
      })
    );

    // Create the booking with the saved tickets
    const booking = new bookingModel({
      user_id,
      totalPrice,
      bookingDate: new Date(),
      numberOfTickets: tickets.length,
      bookingStatus: "Confirmed",
      tickets: createdTickets, // Store the saved ticket objects
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
