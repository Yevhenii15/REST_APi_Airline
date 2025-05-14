import { Request, Response } from "express";
import { flightModel } from "../models/flightModel";
import { routeModel } from "../models/routeModel";
import { connect, disconnect } from "../database/database";
import moment from "moment";

// Function to check if a return route exists
async function checkReturnRouteExists(routeData: any): Promise<any> {
  return await routeModel.findOne({
    departureAirport_id: routeData.arrivalAirport_id,
    arrivalAirport_id: routeData.departureAirport_id,
  });
}

// Function to create a new return route if needed
async function createReturnRoute(routeData: any): Promise<any> {
  const returnRoute = new routeModel({
    departureAirport_id: routeData.arrivalAirport_id,
    arrivalAirport_id: routeData.departureAirport_id,
    duration: routeData.duration,
  });

  return await returnRoute.save();
}

// Check for duplicate flight based on route and time
async function checkDuplicateFlight(
  routeId: string,
  departureTime: string,
  departureDay: string
) {
  return await flightModel.findOne({
    "route._id": routeId,
    departureTime: departureTime,
    departureDay: departureDay,
  });
}

// Calculate arrival times for both outbound and return flights
function calculateArrivalTimes(departureTime: string, duration: string) {
  const [depHour, depMin] = departureTime.split(":").map(Number);
  const [durHour, durMin] = duration.split(":").map(Number);

  const departureDateTime = new Date();
  departureDateTime.setHours(depHour, depMin);

  const durationInMinutes = durHour * 60 + durMin;
  const outboundArrivalDateTime = new Date(
    departureDateTime.getTime() + durationInMinutes * 60000
  );
  const outboundArrivalTimeString = outboundArrivalDateTime
    .toTimeString()
    .slice(0, 5);

  const returnDepartureTime = new Date(
    outboundArrivalDateTime.getTime() + 45 * 60000
  );
  const returnDepartureTimeString = returnDepartureTime
    .toTimeString()
    .slice(0, 5);

  const returnArrivalDateTime = new Date(
    returnDepartureTime.getTime() + durationInMinutes * 60000
  );
  const returnArrivalTimeString = returnArrivalDateTime
    .toTimeString()
    .slice(0, 5);

  return {
    outboundArrivalTimeString,
    returnDepartureTimeString,
    returnArrivalTimeString,
  };
}

// Determine if return flight needs to be on the next day
function getNextDayIfNeeded(
  departureDay: string,
  departureTime: string,
  returnDepartureTime: string
): string {
  const returnHour = parseInt(returnDepartureTime.split(":")[0], 10);
  const departureHour = parseInt(departureTime.split(":")[0], 10);

  if (returnHour < departureHour) {
    return moment().day(departureDay).add(1, "days").format("dddd");
  }
  return departureDay;
}

export async function createFlight(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const {
      route,
      departureTime,
      departureDay,
      flightNumber,
      operatingPeriod,
      status,
      aircraft_id,
      seatMap,
      basePrice,
      isReturnFlightRequired,
    } = req.body;

    // Validate route and find route data
    const routeData = await routeModel.findById(route);
    if (!routeData) {
      res.status(404).json({ error: "Route not found" });
      return;
    }

    const duplicateFlight = await checkDuplicateFlight(
      routeData._id.toString(),
      departureTime,
      departureDay
    );
    if (duplicateFlight) {
      res.status(400).json({ error: "Duplicate flight found" });
      return;
    }

    // Calculate arrival times
    const arrivalTimes = calculateArrivalTimes(
      departureTime,
      routeData.duration
    );

    // Create the outbound flight
    const outboundFlight = new flightModel({
      ...req.body,
      route: {
        _id: routeData._id,
        departureAirport_id: routeData.departureAirport_id,
        arrivalAirport_id: routeData.arrivalAirport_id,
        duration: routeData.duration,
      },
      arrivalTime: arrivalTimes.outboundArrivalTimeString,
    });

    const outboundResult = await outboundFlight.save();

    // If return flight is needed, check if a return route exists, or create one
    if (isReturnFlightRequired) {
      let returnRoute = await checkReturnRouteExists(routeData);

      // If no return route exists, create a new one
      if (!returnRoute) {
        returnRoute = await createReturnRoute(routeData);
      }

      const returnDepartureDay = getNextDayIfNeeded(
        departureDay,
        departureTime,
        arrivalTimes.returnDepartureTimeString
      );

      const returnFlight = new flightModel({
        ...req.body,
        flightNumber: `${flightNumber}-R`,
        departureDay: returnDepartureDay,
        departureTime: arrivalTimes.returnDepartureTimeString,
        arrivalTime: arrivalTimes.returnArrivalTimeString,
        route: {
          _id: returnRoute._id,
          departureAirport_id: returnRoute.departureAirport_id,
          arrivalAirport_id: returnRoute.arrivalAirport_id,
          duration: returnRoute.duration,
        },
      });

      const returnResult = await returnFlight.save();
      res
        .status(201)
        .json({ outboundFlight: outboundResult, returnFlight: returnResult });
      return;
    }

    // If no return flight, just return the outbound flight
    res.status(201).json({ outboundFlight: outboundResult });
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
    const flight = await getFlightById(flightId);

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
 */ export async function updateFlightById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;

  try {
    await connect();

    // console.log("Received flight update data:", req.body);

    let updatedFields = { ...req.body };

    const existingFlight = await flightModel.findById(id);
    if (!existingFlight) {
      res.status(404).json({ error: "Flight not found" });
      return;
    }

    let route;
    if (req.body.route) {
      const routeId = req.body.route._id || req.body.route;
      route = await routeModel.findById(routeId);

      if (!route) {
        // console.log("Route not found:", routeId);
        res.status(404).json({ error: "Route not found" });
        return;
      }

      // console.log("Found route:", route);

      updatedFields.route = {
        _id: route._id,
        departureAirport_id: route.departureAirport_id,
        arrivalAirport_id: route.arrivalAirport_id,
        duration: route.duration,
      };
    }

    if (route || req.body.departureTime) {
      const duration = route?.duration || existingFlight.route?.duration;
      if (duration) {
        const arrivalTimes = calculateArrivalTimes(
          req.body.departureTime || existingFlight.departureTime,
          duration
        );

        updatedFields.arrivalTime = arrivalTimes.outboundArrivalTimeString;
        // console.log("Updated Arrival Time:", updatedFields.arrivalTime);
      }
    }

    const result = await flightModel.updateOne(
      { _id: id },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).send("Cannot update flight with id=" + id);
      return;
    }

    // console.log("Flight updated successfully.");
    res.status(200).send("Flight was successfully updated.");
  } catch (err) {
    console.error("Error updating flight:", err);
    res.status(500).json({ error: "Error updating flight", details: err });
  } finally {
    await disconnect();
  }
}

export async function deleteFlightById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await flightModel.findByIdAndUpdate(
      id,
      { status: "Cancelled", cancelledAt: new Date() }, // ✅ Include this
      { new: true }
    );

    if (!result) {
      res.status(404).send("Cannot cancel flight with id=" + id);
    } else {
      res.status(200).send("Flight was successfully canceled.");
    }
  } catch (err) {
    res.status(500).send("Error canceling flight by id. Error: " + err);
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
