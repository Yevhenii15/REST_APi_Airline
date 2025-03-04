import { Router, Request, Response } from "express";
import {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlightById,
  deleteFlightById,
  getFlightByQuery,
} from "./controllers/flightController";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRouteById,
  deleteRouteById,
  getRouteByQuery,
} from "./controllers/routeController";
import { registerUser, loginUser } from "./controllers/userController";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is running
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});
// Read flights
/**
 * @swagger
 * /flights:
 *   get:
 *     tags:
 *       - Flight Routes
 *     summary: Retrieve all flights
 *     description: Fetches all flights from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved flights
 */
router.get("/flights", getAllFlights);
/**
 * @swagger
 * /flights/{id}:
 *   get:
 *     tags:
 *       - Flight Routes
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
router.get("/flights/:id", getFlightById);
/**
 * @swagger
 * /flights/query/{key}/{val}:
 *   get:
 *     tags:
 *       - Flight Routes
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
router.get("/flights/query/:key/:val", getFlightByQuery);
// Create Update Delete flights
/**
 * @swagger
 * /flights:
 *   post:
 *     tags:
 *       - Flight Routes
 *     summary: Create a new flight
 *     description: Adds a new flight to the database
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         appliflightion/json:
 *           schema:
 *             $ref: "#/components/schemas/Flight"
 *     responses:
 *       201:
 *         description: Flight created successfully
 */
router.post("/flights", createFlight);
/**
 * @swagger
 * /flights/{id}:
 *   put:
 *     tags:
 *       - Flight Routes
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
 *         appliflightion/json:
 *           schema:
 *             $ref: "#/components/schemas/Flight"
 *     responses:
 *       200:
 *         description: Flight updated successfully
 */
router.put("/flights/:id", updateFlightById);
/**
 * @swagger
 * /flights/{id}:
 *   delete:
 *     tags:
 *       - Flight Routes
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
router.delete("/flights/:id", deleteFlightById);

// Read routes
router.get("/routes", getAllRoutes);
router.get("/routes/:id", getRouteById);
router.get("/routes/query/:key/:val", getRouteByQuery);
// Create Update Delete routes
router.post("/routes", createRoute);
router.put("/routes/:id", updateRouteById);
router.delete("/routes/:id", deleteRouteById);

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Registers a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         appliflightion/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/user/register", registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login user
 *     description: Authentiflightes a user and returns a token
 *     requestBody:
 *       required: true
 *       content:
 *         appliflightion/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/user/login", loginUser);

export default router;
