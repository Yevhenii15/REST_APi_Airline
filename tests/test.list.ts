process.env.NODE_ENV = "test";

import { test } from "@playwright/test";

import health from "./health.test";
import userRegister from "./user.test";



import { userModel } from "../src/models/userModel";
import { bookingModel } from "../src/models/bookingModel";


import dotenvFlow from "dotenv-flow";
import { connect, disconnect } from "../src/database/database";
dotenvFlow.config();

function setup() {
    // beforeEach clear database
    test.beforeEach(async () => {
    try {
        await connect();
        await userModel.deleteMany({});
        await bookingModel.deleteMany({});
    } finally {
        await disconnect();
    }
    });
    // afterAll clear database
    test.afterAll(async () => {
    try {
        await connect();
        await userModel.deleteMany({});
        await bookingModel.deleteMany({});
    } finally {
        await disconnect();
    }
    });
}

setup();


test.describe(health);
test.describe(userRegister);

