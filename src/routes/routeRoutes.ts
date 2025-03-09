import { Router } from "express";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRouteById,
  deleteRouteById,
  getRouteByQuery,
} from "../controllers/routeController";
import { verifyAdmin } from "../controllers/userController";

const router: Router = Router();

// Read routes
/**
 * @swagger
 * /routes:
 *   get:
 *     tags:
 *       - Route Routes
 *     summary: Retrieve all routes
 *     description: Fetches all routes from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved routes
 */
router.get("/", getAllRoutes);
/**
 * @swagger
 * /routes/{id}:
 *   get:
 *     tags:
 *       - Route Routes
 *     summary: Get a route by ID
 *     description: Retrieves a single route using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Route ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved route
 */
router.get("/:id", getRouteById);
/**
 * @swagger
 * /routes/query/{key}/{val}:
 *   get:
 *     tags:
 *       - Route Routes
 *     summary: Get route by query
 *     description: Fetches a route based on query parameters
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
 *         description: Successfully retrieved route
 */
router.get("/query/:key/:val", getRouteByQuery);

// Create Update Delete routes

/**
 * @swagger
 * /routes:
 *   post:
 *     tags:
 *       - Route Routes
 *     summary: Create a new route
 *     description: Adds a new route to the database
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Route"
 *     responses:
 *       201:
 *         description: Route created successfully
 */
router.post("/", verifyAdmin, createRoute);
/**
 * @swagger
 * /routes/{id}:
 *   put:
 *     tags:
 *       - Route Routes
 *     summary: Update a route by ID
 *     description: Updates a specific route based on its ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Route ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Route"
 *     responses:
 *       200:
 *         description: Route updated successfully
 */
router.put("/:id", verifyAdmin, updateRouteById);
/**
 * @swagger
 * /routes/{id}:
 *   delete:
 *     tags:
 *       - Route Routes
 *     summary: Delete a route by ID
 *     description: Deletes a route from the database
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Route ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route deleted successfully
 */
router.delete("/:id", verifyAdmin, deleteRouteById);

export default router;
