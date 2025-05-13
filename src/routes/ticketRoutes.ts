import { Router } from "express";
import {
  getBookedSeats,
  updateTicket,
  getTicketsByUser,
} from "../controllers/ticketController";
import { verifyLoggedIn } from "../controllers/userController";

const router: Router = Router();
/**
 * @swagger
 * /tickets/booked/{flight_id}/{flight_date}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Get booked seats for a specific flight
 *     description: Returns a list of booked seats for a specific flight on a given date.
 *     parameters:
 *       - in: path
 *         name: flight_id
 *         required: true
 *         description: The ID of the flight to check for booked seats.
 *         schema:
 *           type: string
 *       - in: path
 *         name: flight_date
 *         required: true
 *         description: The date of the flight in YYYY-MM-DD format.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of booked seats for the specified flight.
 */

router.get("/booked/:flight_id/:flight_date", getBookedSeats);

router.put("/:ticketId", verifyLoggedIn, updateTicket);

router.get("/:userId", verifyLoggedIn, getTicketsByUser);

export default router;
