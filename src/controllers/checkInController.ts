import { Request, Response } from "express";
import { ticketModel } from "../models/ticketModel";
import { connect, disconnect } from "../database/database";

import { bookingModel } from "../models/bookingModel"; // Import your booking model

export async function checkInTicket(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const { ticketId } = req.params;
    const { passportNumber, dateOfBirth, nationality, expirationDate } =
      req.body;

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    if (ticket.isCheckedIn) {
      res.status(400).json({ message: "Ticket already checked in" });
      return;
    }

    // Update ticket document
    ticket.passportNumber = passportNumber;
    ticket.dateOfBirth = dateOfBirth;
    ticket.nationality = nationality;
    ticket.expirationDate = expirationDate;
    ticket.isCheckedIn = true;
    ticket.checkInTime = new Date();
    await ticket.save();

    // Update embedded ticket in booking
    await bookingModel.updateOne(
      { "tickets._id": ticket._id },
      {
        $set: {
          "tickets.$.passportNumber": passportNumber,
          "tickets.$.dateOfBirth": dateOfBirth,
          "tickets.$.nationality": nationality,
          "tickets.$.expirationDate": expirationDate,
          "tickets.$.isCheckedIn": true,
          "tickets.$.checkInTime": ticket.checkInTime,
        },
      }
    );

    res.status(200).json({ message: "Check-in successful", ticket });
  } catch (err) {
    res.status(500).json({ message: "Error during check-in", error: err });
  } finally {
    await disconnect();
  }
}
