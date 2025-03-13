import { Request, Response } from "express";
import { connect, disconnect } from "../database/database";
import { routeModel } from "../models/routeModel";
import { airportModel } from "../models/airportModel";

/**
 * Validates if the provided airports exist in the database.
 * @param departureAirport_id - IATA code of departure airport.
 * @param arrivalAirport_id - IATA code of arrival airport.
 * @returns {Promise<{ valid: boolean; error?: string; missing?: object }>}
 */
async function validateAirports(
  departureAirport_id: string,
  arrivalAirport_id: string
) {
  await connect();

  const departureAirport = await airportModel.findOne({
    airportCode: departureAirport_id,
  });
  const arrivalAirport = await airportModel.findOne({
    airportCode: arrivalAirport_id,
  });

  if (!departureAirport || !arrivalAirport) {
    return {
      valid: false,
      error: "Invalid route. One or both of the airports do not exist.",
      missing: {
        departureAirport: departureAirport ? "Exists" : "Not Found",
        arrivalAirport: arrivalAirport ? "Exists" : "Not Found",
      },
    };
  }

  return { valid: true };
}

/**
 * Creates a new flight route if both airports exist.
 * @param req
 * @param res
 */
export async function createRoute(req: Request, res: Response): Promise<void> {
  const { departureAirport_id, arrivalAirport_id, duration } = req.body;

  try {
    const validation = await validateAirports(
      departureAirport_id,
      arrivalAirport_id
    );
    if (!validation.valid) {
      res.status(404).json(validation);
      return;
    }

    const newRoute = new routeModel({
      departureAirport_id,
      arrivalAirport_id,
      duration,
    });
    const savedRoute = await newRoute.save();

    res.status(201).json(savedRoute);
  } catch (err) {
    res.status(500).json({ error: "Error creating route", details: err });
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves all flight routes from the data source
 * @param req
 * @param res
 */
export async function getAllRoutes(req: Request, res: Response) {
  try {
    await connect();

    const result = await routeModel.find({});

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving routes. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a flight route by its ID from the data source
 * @param req
 * @param res
 */
export async function getRouteById(req: Request, res: Response) {
  try {
    await connect();

    const id = req.params.id;
    const result = await routeModel.findById(id);

    if (!result) {
      res.status(404).send("Route not found with id=" + id);
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).send("Error retrieving route by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Updates a flight route by ID if both airports exist.
 * @param req
 * @param res
 */
export async function updateRouteById(req: Request, res: Response) {
  const { departureAirport_id, arrivalAirport_id, duration } = req.body;
  const id = req.params.id;

  try {
    const validation = await validateAirports(
      departureAirport_id,
      arrivalAirport_id
    );
    if (!validation.valid) {
      res.status(404).json(validation);
      return;
    }

    const updatedRoute = await routeModel.findByIdAndUpdate(
      id,
      { departureAirport_id, arrivalAirport_id, duration },
      { new: true }
    );

    if (!updatedRoute) {
      res.status(404).json({ error: "Cannot update route with id=" + id });
      return;
    }

    res.status(200).json(updatedRoute);
  } catch (err) {
    res.status(500).json({ error: "Error updating route", details: err });
  } finally {
    await disconnect();
  }
}
/**
 * Deletes a flight route by its ID
 * @param req
 * @param res
 */
export async function deleteRouteById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await routeModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send("Cannot delete route with id=" + id);
    } else {
      res.status(200).send("Route was successfully deleted.");
    }
  } catch (err) {
    res.status(500).send("Error deleting route by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves flight routes based on a query
 * @param req
 * @param res
 */
export async function getRouteByQuery(req: Request, res: Response) {
  const key = req.params.key;
  const val = req.params.val;

  try {
    await connect();

    const result = await routeModel.find({
      [key]: { $regex: val, $options: "i" },
    });

    res.status(200).send(result);
  } catch (err) {
    res
      .status(500)
      .send(
        "Error retrieving route with query key=" + key + " and value=" + val
      );
  } finally {
    await disconnect();
  }
}
