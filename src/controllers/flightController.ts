import { Request, Response } from "express";
import { flightModel } from "../models/flightModel";
import { routeModel } from "../models/routeModel";
import { connect, disconnect } from "../database/database";

/**
 * Creates a new flight using an existing route
 * @param req
 * @param res
 */
export async function createFlight(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    // Validate route existence
    const route = await routeModel.findById(req.body.route);
    if (!route) {
      res.status(404).send("Error: Route not found.");
      return;
    }

    req.body.route = route; // Assign full route object

    const flight = new flightModel(req.body);
    const result = await flight.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error creating flight. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves all flights with populated route details
 * @param req
 * @param res
 */
export async function getAllFlights(req: Request, res: Response) {
  try {
    await connect();

    const result = await flightModel.find({}).populate("route");

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving flights. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a flight by its ID with populated route details
 * @param req
 * @param res
 */
export async function getFlightById(req: Request, res: Response) {
  try {
    await connect();

    const result = await flightModel.findById(req.params.id).populate("route");

    if (!result) {
      res.status(404).send("Flight not found.");
      return;
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving flight by ID. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Updates a flight by its ID, validating route if provided
 * @param req
 * @param res
 */
export async function updateFlightById(req: Request, res: Response) {
  try {
    await connect();

    // If a route is being updated, validate it
    if (req.body.route) {
      const route = await routeModel.findById(req.body.route);
      if (!route) {
        res.status(404).send("Error: Route not found.");
        return;
      }
      req.body.route = route;
    }

    const result = await flightModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!result) {
      res.status(404).send("Cannot update flight with id=" + req.params.id);
    } else {
      res.status(200).send("Flight was successfully updated.");
    }
  } catch (err) {
    res.status(500).send("Error updating flight by ID. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Deletes a flight by its ID
 * @param req
 * @param res
 */
export async function deleteFlightById(req: Request, res: Response) {
  try {
    await connect();

    const result = await flightModel.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).send("Cannot delete flight with id=" + req.params.id);
    } else {
      res.status(200).send("Flight was successfully deleted.");
    }
  } catch (err) {
    res.status(500).send("Error deleting flight by ID. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves flights based on a query (e.g., flightNumber)
 * @param req
 * @param res
 */
export async function getFlightByQuery(req: Request, res: Response) {
  try {
    await connect();

    const result = await flightModel
      .find({
        [req.params.key]: { $regex: req.params.val, $options: "i" },
      })
      .populate("route");

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving flights. Error: " + err);
  } finally {
    await disconnect();
  }
}
