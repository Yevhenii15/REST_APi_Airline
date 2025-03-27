import { Request, Response } from "express";
import { flightModel } from "../models/flightModel";
import { routeModel } from "../models/routeModel";
import { connect, disconnect } from "../database/database";

/**
 * Creates a new flight in the data source based on the request body.
 * Automatically calculates the arrival time using the route's duration.
 */
export async function createFlight(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    console.log("Received flight data:", req.body);

    // Find the route by ID
    const route = await routeModel.findById(req.body.route);
    if (!route) {
      console.log("Route not found:", req.body.route);
      res.status(404).json({ error: "Route not found" });
      return;
    }

    console.log("Found route:", route);

    // Convert "HH:mm" duration to total minutes
    const [hours, minutes] = route.duration.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      res.status(400).json({ error: "Invalid route duration format" });
      return;
    }
    const durationInMinutes = hours * 60 + minutes;

    // Calculate arrival time
    const departureTime = new Date(req.body.departureTime);
    const arrivalTime = new Date(
      departureTime.getTime() + durationInMinutes * 60000
    );

    console.log("Calculated arrivalTime:", arrivalTime.toISOString());

    // Create the flight with calculated arrivalTime
    const flight = new flightModel({
      ...req.body,
      arrivalTime, // Ensure it's explicitly set
      route: {
        _id: route._id,
        departureAirport_id: route.departureAirport_id,
        arrivalAirport_id: route.arrivalAirport_id,
        duration: route.duration,
      },
    });

    const result = await flight.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating flight:", err);
    res.status(500).json({ error: "Error creating flight", details: err });
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
 * Fetch flight details by ID (Reusable Helper Function)
 */
export async function getFlightById(flightId: string) {
  return await flightModel.findById(flightId);
}

/**
 * Express Route Handler - Retrieves a flight by its ID
 */
export async function getFlightByIdHandler(req: Request, res: Response) {
  try {
    await connect();

    const flightId = req.params.id;
    const flight = await getFlightById(flightId); // 🔹 Using the helper function

    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }

    res.status(200).json(flight);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving flight", error: err });
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a flight by its id from the data sources
 * @param req
 * @param res
 */
export async function updateFlightById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;

  try {
    await connect();

    console.log("Received flight update data:", req.body);

    let updatedFields = { ...req.body };

    let route;
    if (req.body.route) {
      const routeId = req.body.route._id || req.body.route; // Handle both object and string formats
      route = await routeModel.findById(routeId);

      if (!route) {
        console.log("Route not found:", routeId);
        res.status(404).json({ error: "Route not found" });
        return;
      }

      console.log("Found route:", route);

      // Embed the route details
      updatedFields.route = {
        _id: route._id,
        departureAirport_id: route.departureAirport_id,
        arrivalAirport_id: route.arrivalAirport_id,
        duration: route.duration,
      };
    }

    // Recalculate arrival time if the route OR departure time is updated
    if (route || req.body.departureTime) {
      const duration = route?.duration || updatedFields.route?.duration;
      if (duration) {
        const [hours, minutes] = duration.split(":").map(Number);
        const durationInMinutes = hours * 60 + minutes;
        const departureTime = new Date(
          req.body.departureTime ||
            (await flightModel.findById(id))?.departureTime
        );
        const arrivalTime = new Date(
          departureTime.getTime() + durationInMinutes * 60000
        );

        console.log("Recalculated arrivalTime:", arrivalTime.toISOString());
        updatedFields.arrivalTime = arrivalTime;
      }
    }

    // Update the flight document
    const result = await flightModel.updateOne(
      { _id: id },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).send("Cannot update flight with id=" + id);
    } else {
      res.status(200).send("Flight was successfully updated.");
    }
  } catch (err) {
    console.error("Error updating flight:", err);
    res.status(500).json({ error: "Error updating flight", details: err });
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
