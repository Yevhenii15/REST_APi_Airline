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
/**
 * @swagger
 * /tickets/{ticketId}:
 *   put:
 *     tags:
 *       - Tickets
 *     summary: Update ticket information
 *     description: Update the details of a specific ticket.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: The ID of the ticket to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seat_number:
 *                 type: string
 *                 example: "14B"
 *               passenger_name:
 *                 type: string
 *                 example: "Jane Doe"
 *               special_requests:
 *                 type: string
 *                 example: "Vegetarian meal"
 *     responses:
 *       200:
 *         description: Ticket successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket successfully updated"
 *       400:
 *         description: Invalid data provided
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.put("/:ticketId", verifyLoggedIn, updateTicket);
/**
 * @swagger
 * /tickets/{userId}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Get all tickets for a user
 *     description: Returns a list of all tickets associated with a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to get tickets for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tickets for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticket_id:
 *                     type: string
 *                     example: "123456"
 *                   flight_id:
 *                     type: string
 *                     example: "FL123"
 *                   seat_number:
 *                     type: string
 *                     example: "12A"
 *                   passenger_name:
 *                     type: string
 *                     example: "John Doe"
 *       404:
 *         description: User not found or no tickets available
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", verifyLoggedIn, getTicketsByUser);

export default router;
