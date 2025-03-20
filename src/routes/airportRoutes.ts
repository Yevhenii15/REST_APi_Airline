import { Router } from "express";
import {
  fetchAndStoreAirport,
  getAllAirports,
  deleteAirportById,
} from "../controllers/airportController";
import { verifyAdmin } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /airports/fetch/{airportCode}:
 *   get:
 *     tags:
 *      - Airports
 *     summary: Fetch airport data by IATA code
 *     description: Fetches airport details from an external API and stores them in MongoDB.
 *     parameters:
 *       - in: path
 *         name: airportCode
 *         required: true
 *         description: IATA airport code (e.g., "JFK", "LAX")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved and stored airport data.
 *       400:
 *         description: Airport code is required.
 *       404:
 *         description: No airport found.
 *       500:
 *         description: Internal server error.
 */
router.get("/fetch/:airportCode", verifyAdmin, fetchAndStoreAirport);

/**
 * @swagger
 * /airports/all:
 *   get:
 *     tags:
 *      - Airports
 *     summary: Get all stored airports
 *     description: Retrieves all airports stored in MongoDB.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of airports.
 *       500:
 *         description: Internal server error.
 */
router.get("/all", getAllAirports);

/**
 * @swagger
 * /airports/{airportId}:
 *   delete:
 *     summary: Cancel a airport
 *     tags: [Airports]
 *     security:
 *     - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: airportId
 *         required: true
 *         schema:
 *           type: string
 *         example: "B12345"
 *     responses:
 *       200:
 *         description: Airport canceled successfully
 *       404:
 *         description: Airport not found
 *       500:
 *         description: Error canceling airport
 */
router.delete("/:id", verifyAdmin, deleteAirportById);

export default router;
