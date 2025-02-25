import { Request, Response } from "express";
import { airportModel } from "../models/airportModel";
import { connect, disconnect } from "../database/database";

// CRUD - create, read/get, update, delete

/**
 * Creates a new airport in the data source based on the request body
 * @param req
 * @param res
 */
export async function createAirport(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;

  try {
    await connect();

    const product = new airportModel(data);
    const result = await product.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error creating airport. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves all airports from the data sources
 * @param req
 * @param res
 */
export async function getAllAirports(req: Request, res: Response) {
  try {
    await connect();

    const result = await airportModel.find({});

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving airports. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a airport by its id from the data sources
 * @param req
 * @param res
 */
export async function getAirportById(req: Request, res: Response) {
  try {
    await connect();

    const id = req.params.id;
    const result = await airportModel.find({ _id: id });

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving airport by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a airport by its id from the data sources
 * @param req
 * @param res
 */
export async function updateAirportById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await airportModel.findByIdAndUpdate(id, req.body);

    if (!result) {
      res.status(404).send("Cannot update airport with id=" + id);
    } else {
      res.status(200).send("Airport was succesfully updated.");
    }
  } catch (err) {
    res.status(500).send("Error updating airport by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a airport by its id from the data sources
 * @param req
 * @param res
 */
export async function deleteAirportById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await airportModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send("Cannot delete airport with id=" + id);
    } else {
      res.status(200).send("Airport was succesfully deleted.");
    }
  } catch (err) {
    res.status(500).send("Error deleting airport by id. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Get specific airport by id
 * @param req
 * @param res
 */
export async function getAirportByQuery(req: Request, res: Response) {
  const key = req.params.key;
  const val = req.params.val;

  try {
    await connect();

    const result = await airportModel.find({
      [key]: { $regex: val, $options: "i" },
    });

    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving airport with id=" + req.params.id);
  } finally {
    await disconnect();
  }
}