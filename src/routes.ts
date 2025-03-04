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

const router: Router = Router();

// get, post, put, delete (CRUD)

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});
// Read flights
router.get("/flights", getAllFlights);
router.get("/flights/:id", getFlightById);
router.get("/flights/query/:key/:val", getFlightByQuery);
// Create Update Delete flights
router.post("/flights", createFlight);
router.put("/flights/:id", updateFlightById);
router.delete("/flights/:id", deleteFlightById);
// Read routes
router.get("/routes", getAllRoutes);
router.get("/routes/:id", getRouteById);
router.get("/routes/query/:key/:val", getRouteByQuery);
// Create Update Delete routes
router.post("/routes", createRoute);
router.put("/routes/:id", updateRouteById);
router.delete("/routes/:id", deleteRouteById);

export default router;
