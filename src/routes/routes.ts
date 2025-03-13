import { Router } from "express";
import flightRoutes from "./flightRoutes";
import routeRoutes from "./routeRoutes";
import userRoutes from "./userRoutes";
import bookingRoutes from "./bookingRoutes";
import seatRoutes from "./seatRoutes";
import airportRoutes from "./airportRoutes";

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

// Register grouped routes
router.use("/airports", airportRoutes);
router.use("/bookings", bookingRoutes);
router.use("/flights", flightRoutes);
router.use("/routes", routeRoutes);
router.use("/seats", seatRoutes);
router.use("/user", userRoutes);

export default router;
