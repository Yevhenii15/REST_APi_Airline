import { Request, Response } from "express";
import https from "https";
import { airportModel } from "../models/airportModel";
import { connect, disconnect } from "../database/database";

const RAPIDAPI_KEY = "384e5f74afmsh2059f508212d41ap1c1dbcjsn5620b59cb48f";
const RAPIDAPI_HOST = "iata-code-decoder.p.rapidapi.com";

/**
 * Fetch airport data from RapidAPI and store it in MongoDB.
 */
export const fetchAndStoreAirport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await connect();

    const { airportCode } = req.params;
    if (!airportCode) {
      res.status(400).json({ error: "Airport code is required" });
      return;
    }

    const options = {
      method: "GET",
      hostname: RAPIDAPI_HOST,
      path: `/airports?query=${airportCode}`,
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    };

    const fetchData = (): Promise<any> =>
      new Promise((resolve, reject) => {
        const req = https.request(options, (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => (data += chunk));
          apiRes.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(error);
            }
          });
        });

        req.on("error", (error) => reject(error));
        req.end();
      });

    const response = await fetchData();

    if (!response || !response.data || response.data.length === 0) {
      res.status(404).json({ error: "No airport found" });
      return;
    }

    const airportData = response.data[0];

    const airport = {
      name: airportData.name,
      airportCode: airportData.iataCode,
      cityName: airportData.cityName,
      countryCode: airportData.iataCountryCode,
    };

    const updatedAirport = await airportModel.findOneAndUpdate(
      { airportCode: airport.airportCode },
      airport,
      { upsert: true, new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ message: "Airport data updated", airport: updatedAirport });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: (error as Error).message,
    });
  } finally {
    await disconnect();
  }
};

/**
 * Fetch all stored airports from MongoDB.
 */
export const getAllAirports = async (req: Request, res: Response) => {
  try {
    await connect();
    const airports = await airportModel.find();
    res.status(200).json(airports);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await disconnect();
  }
};

/**
 * Deletes a flight airport by its ID
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
      res.status(200).send("Airport was successfully deleted.");
    }
  } catch (err) {
    res.status(500).send("Error deleting airport by id. Error: " + err);
  } finally {
    await disconnect();
  }
}
