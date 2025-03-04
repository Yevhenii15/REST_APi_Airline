import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { connect, disconnect } from "../database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET || "default_secret_key"; // Secret key for JWT



/**
 * Registers a new user
 * @param req
 * @param res
 */
export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    await connect();
    
    const { name, email, phone, password, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, phone, password: hashedPassword, dateOfBirth });
    const result = await user.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error registering user. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Logs in a user
 * @param req
 * @param res
 */
export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    await connect();
    
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(400).send("Invalid email or password");
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send("Invalid email or password");
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).send({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send("Error logging in user. Error: " + err);
  } finally {
    await disconnect();
  }
}
