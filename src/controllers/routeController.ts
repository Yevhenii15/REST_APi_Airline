import { Request, Response } from "express";
import { routeModel } from "../models/routeModel";
import { connect, disconnect } from "../database/database";

/**
 * Creates a new flight route in the data source based on the request body
 * @param req
 * @param res
 */
export async function createRoute(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    await connect();

    const route = new routeModel(data);
    const result = await route.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error creating route. Error: " + err);
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
 * Updates a flight route by its ID
 * @param req
 * @param res
 */
export async function updateRouteById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await routeModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      res.status(404).send("Cannot update route with id=" + id);
    } else {
      res.status(200).send("Route was successfully updated.");
    }
  } catch (err) {
    res.status(500).send("Error updating route by id. Error: " + err);
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
    res.status(500).send("Error retrieving route with query key=" + key + " and value=" + val);
  } finally {
    await disconnect();
  }
}
