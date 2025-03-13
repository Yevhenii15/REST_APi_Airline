import { Router } from "express";
import {
  fetchAndStoreAirport,
  getAllAirports,
} from "../controllers/airportController";

const router = Router();

/**
 * @swagger
 * /airports/fetch/{airportCode}:
 *   get:
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
router.get("/fetch/:airportCode", fetchAndStoreAirport);

/**
 * @swagger
 * /airports/all:
 *   get:
 *     summary: Get all stored airports
 *     description: Retrieves all airports stored in MongoDB.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of airports.
 *       500:
 *         description: Internal server error.
 */
router.get("/all", getAllAirports);

export default router;
