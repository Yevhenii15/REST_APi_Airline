// test.list.ts
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
    await connect();  // Make sure we connect to the database
    await userModel.deleteMany({});  // Remove all users to avoid duplicates
    await routeModel.deleteMany({});  // Remove all routes to avoid duplicates
    await airportModel.deleteMany({});  // Remove all airports to avoid duplicates
  } catch (err) {
    console.error("Error clearing the database:", err);
  } finally {
    await disconnect();  // Always disconnect after cleanup
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

