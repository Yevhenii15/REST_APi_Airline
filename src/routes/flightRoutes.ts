import { Router } from "express";
import {
  createFlight,
  getAllFlights,
  getFlightByIdHandler,
  updateFlightById,
  deleteFlightById,
  getFlightByQuery,
} from "../controllers/flightController";
import { verifyAdmin } from "../controllers/userController";

const router: Router = Router();
// Read flights
/**
 * @swagger
 * /flights:
 *   get:
 *     tags:
 *       - Flights
 *     summary: Retrieve all flights
 *     description: Fetches all flights from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved flights
 */
router.get("/", getAllFlights);
/**
 * @swagger
 * /flights/{id}:
 *   get:
 *     tags:
 *       - Flights
 *     summary: Get a flight by ID
 *     description: Retrieves a single flight using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Flight ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved flight
 */
router.get("/:id", getFlightByIdHandler);
/**
 * @swagger
 * /flights/query/{key}/{val}:
 *   get:
 *     tags:
 *       - Flights
 *     summary: Get flight by query
 *     description: Fetches a flight based on query parameters
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Query key
 *         schema:
 *           type: string
 *       - in: path
 *         name: val
 *         required: true
 *         description: Query value
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved flight
 */
router.get("/query/:key/:val", getFlightByQuery);
// Create Update Delete flights
/**
 * @swagger
 * /flights:
 *   post:
 *     tags:
 *       - Flights
 *     summary: Create a new flight
 *     description: Adds a new flight to the database
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Flight"
 *     responses:
 *       201:
 *         description: Flight created successfully
 */
router.post("/", verifyAdmin, createFlight);
/**
 * @swagger
 * /flights/{id}:
 *   put:
 *     tags:
 *       - Flights
 *     summary: Update a flight by ID
 *     description: Updates a specific flight based on its ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Flight ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Flight"
 *     responses:
 *       200:
 *         description: Flight updated successfully
 */
router.put("/:id", verifyAdmin, updateFlightById);
/**
 * @swagger
 * /flights/{id}:
 *   delete:
 *     tags:
 *       - Flights
 *     summary: Delete a flight by ID
 *     description: Deletes a flight from the database
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Flight ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight deleted successfully
 */
router.delete("/:id", verifyAdmin, deleteFlightById);

export default router;
