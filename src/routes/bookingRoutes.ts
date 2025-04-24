import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController";
import { verifyLoggedIn, verifyAdmin } from "../controllers/userController";

const router: Router = Router();
/**
 * @swagger
 * /bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     description: Adds a new booking to the database
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Booking"
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/", verifyLoggedIn, createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *      - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Booking"
 *       500:
 *         description: Error fetching bookings
 */
router.get("/", verifyAdmin, getAllBookings);

/**
 * @swagger
 * /bookings/user/{userId}:
 *   get:
 *     summary: Get all bookings for a specific user
 *     tags: [Bookings]
 *     security:
 *        - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "U12345"
 *     responses:
 *       200:
 *         description: List of user bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Booking"
 *       404:
 *         description: No bookings found for this user
 *       500:
 *         description: Error fetching bookings
 */
router.get("/user/:id", verifyLoggedIn, getUserBookings);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get a specific booking by ID
 *     tags: [Bookings]
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         example: "B12345"
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Booking"
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Error fetching booking
 */
router.get("/:id", verifyLoggedIn, getBookingById);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *     - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         example: "B12345"
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Error canceling booking
 */
router.patch("/:id/cancel", verifyLoggedIn, cancelBooking);

export default router;
