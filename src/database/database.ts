import mongoose from "mongoose";

let isConnected = false;
let activeRequests = 0;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connect() {
  if (!process.env.DBHOST) {
    throw new Error("DBHOST environment variable is not defined");
  }

  if (!isConnected) {
    if (!connectionPromise) {
      connectionPromise = mongoose.connect(process.env.DBHOST, {
        serverSelectionTimeoutMS: 20000,
      });
    }

    await connectionPromise;

    if (mongoose.connection.readyState === 1) {
      //console.log("Connected to MongoDB");
      isConnected = true;
    } else {
      throw new Error("Database connection is not established");
    }
  }

  activeRequests++;
}

/**
 * Disconnect from the database only when all active requests are finished
 */
export async function disconnect() {
  try {
    activeRequests--; // Decrement active request count

    if (activeRequests <= 0 && isConnected) {
      await mongoose.disconnect();
      isConnected = false;
      connectionPromise = null; // Reset the connection promise
      //console.log("Connection closed");
    }
  } catch (error) {
    console.error("Error closing database connection. Error: " + error);
  }
}

/**
 * Test the connection to the database
 */
export async function testConnection() {
  try {
    await connect();
    await disconnect();
    console.log(
      "Database connection test was successful (connect + disconnect)"
    );
  } catch (error) {
    console.error("Error testing database connection. Error: " + error);
  }
}
