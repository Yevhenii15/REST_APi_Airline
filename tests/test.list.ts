process.env.NODE_ENV = "test";

import { test } from "@playwright/test";
import { userTests } from "./user.test";
import { airportTests } from "./airport.test";
import { routeTests } from "./route.test";
import { userModel } from "../src/models/userModel";
import { routeModel } from "../src/models/routeModel";
import { airportModel } from "../src/models/airportModel";
import dotenvFlow from "dotenv-flow";
import { connect, disconnect } from "../src/database/database";

dotenvFlow.config();

// Global setup and teardown
test.beforeEach(async () => {
  try {
    await connect();
    await userModel.deleteMany({});
    await routeModel.deleteMany({});
    await airportModel.deleteMany({});
  } catch (err) {
    console.error("Error clearing the database:", err);
  } finally {
    await disconnect();
  }
});

test.afterAll(async () => {
  try {
    await connect();
    await userModel.deleteMany({});
    await routeModel.deleteMany({});
    await airportModel.deleteMany({});
  } finally {
    await disconnect();
  }
});

// Register test
userTests();
airportTests();
routeTests();
