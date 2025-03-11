import { Router } from "express";
import { getSeatAvailability } from "../controllers/seatController";

const router: Router = Router();

/**
 * @swagger
 * /seats/{flightId}:
 *   get:
 *     summary: Get seat availability for a flight
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: flightId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flight.
 *     responses:
 *       200:
 *         description: Successfully retrieved seat availability.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flightId:
 *                   type: string
 *                 totalSeats:
 *                   type: number
 *                 bookedSeats:
 *                   type: array
 *                   items:
 *                     type: string
 *                 availableSeats:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Flight not found.
 *       500:
 *         description: Error fetching seat availability.
 */
router.get("/:flightId", getSeatAvailability);

export default router;
