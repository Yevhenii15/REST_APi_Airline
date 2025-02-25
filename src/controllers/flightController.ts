import { Request, Response } from "express";
import { flightModel } from "../models/flightModel";
import { connect, disconnect } from "../database/database";

/**
 * Creates a new flight in the data source based on the request body
 * @param req
 * @param res
 */
export async function createFlight(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    await connect();

    const flight = new flightModel(data);
    const result = await flight.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error creating flight. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves all flights from the data sources
 * @param req
 * @param res
 */
export async function getAllFlights(req: Request, res: Response) {
  try {
    await connect();

    const result = await flightModel.find({});

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving flights. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a flight by its id from the data sources
 * @param req
 * @param res
 */
export async function getFlightById(req: Request, res: Response) {
  try {
    await connect();

    const id = req.params.id;
    const result = await flightModel.find({ _id: id });

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving flight by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a flight by its id from the data sources
 * @param req
 * @param res
 */
export async function updateFlightById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await flightModel.findByIdAndUpdate(id, req.body);

    if (!result) {
      res.status(404).send("Cannot update flight with id=" + id);
    } else {
      res.status(200).send("Flight was succesfully updated.");
    }
  } catch (err) {
    res.status(500).send("Error updating flight by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a flight by its id from the data sources
 * @param req
 * @param res
 */
export async function deleteFlightById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await flightModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send("Cannot delete flight with id=" + id);
    } else {
      res.status(200).send("Flight was succesfully deleted.");
    }
  } catch (err) {
    res.status(500).send("Error deleting flight by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Get specific flight by id
 * @param req
 * @param res
 */
export async function getFlightByQuery(req: Request, res: Response) {
  const key = req.params.key;
  const val = req.params.val;

  try {
    await connect();

    const result = await flightModel.find({
      [key]: { $regex: val, $options: "i" },
    });

    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving flight with id=" + req.params.id);
  } finally {
    await disconnect();
  }
}
