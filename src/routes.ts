import { Router, Request, Response } from "express";
import {
  createFlight,
  getAllFlights,
  getFlightById,
  updateFlightById,
  deleteFlightById,
  getFlightByQuery,
} from "./controllers/flightController";

const router: Router = Router();

// get, post, put, delete (CRUD)

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});

router.post("/flights", createFlight);
router.get("/flights", getAllFlights);
router.get("/flights/:id", getFlightById);
router.get("/flights/query/:key/:val", getFlightByQuery);
router.put("/flights/:id", updateFlightById);
router.delete("/flights/:id", deleteFlightById);

export default router;
