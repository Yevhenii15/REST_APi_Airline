import { Router } from "express";
import flightRoutes from "./flightRoutes";
import routeRoutes from "./routeRoutes";
import userRoutes from "./userRoutes";
import bookingRoutes from "./bookingRoutes";
import seatRoutes from "./seatRoutes";
import airportRoutes from "./airportRoutes";
import aboutRoutes from "./aboutRoutes";
import { startCron } from "../controllers/devToolsController";

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
router.get("/", (req, res) => {
  res.status(200).send("Welcome to the API");
});


/**
 * @swagger
 * /start-cron:
 *   get:
 *     tags:
 *       - Start Cron Jobs
 *     summary: Starts the cron job that keep render alive
 *     description: Starts the cron job that keep render alive
 *     responses:
 *       200:
 *         description: Response from the cron job
 *         content:
 *           application/json:
 *             schema:
 *               type: array               
 */
router.get('/start-cron', startCron);

// Register grouped routes
router.use("/airports", airportRoutes);
router.use("/bookings", bookingRoutes);
router.use("/flights", flightRoutes);
router.use("/routes", routeRoutes);
router.use("/seats", seatRoutes);
router.use("/user", userRoutes);
router.use("/about", aboutRoutes);

export default router;
