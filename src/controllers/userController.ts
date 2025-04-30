// imports
import { type Request, type Response, type NextFunction } from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from "../database/database";

export async function getUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // connect before querying
    await connect();

    const { id } = req.params;
    const user = await userModel
      .findById(id)
      .select("name email phone dateOfBirth isAdmin");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err });
  } finally {
    // always disconnect
    await disconnect();
  }
}

/**
 * Register a new user
 * @param req
 * @param res
 * @returns
 */
export async function registerUser(req: Request, res: Response) {
  try {
    // validate the user and password info
    const { error } = validateUserRegistrationInfo(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    // check if the email is already registered
    const emailExists = await userModel.findOne({ email: req.body.email });

    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    // create a user object and save in the DB
    const userObject = new userModel({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: passwordHashed,
      dateOfBirth: req.body.dateOfBirth,
      isAdmin: false,
    });

    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(500).send("Error registrering user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Login an existing user
 * @param req
 * @param res
 * @returns
 */
export async function loginUser(req: Request, res: Response) {
  try {
    const { error } = validateUserLoginInfo(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();
    const user: User | null = await userModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    }

    const validPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    }

    const userId: string = user._id;

    const token: string = jwt.sign(
      {
        id: userId,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      error: null,
      data: {
        token,
        user: {
          userId, // Add this line
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    res.status(500).send("Error logging in user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Middleware logic to verify the client JWT token
 * @param req
 * @param res
 * @param next
 */
export function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access Denied." });
    return;
  }

  try {
    const verifiedUser = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { isAdmin: boolean };

    if (!verifiedUser.isAdmin) {
      res.status(403).json({ error: "Forbidden: Admins only" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
}
export function verifyLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access Denied: No token provided." });
    return;
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next(); // Proceed if token is valid
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Validate user registration info (name, email, password)
 * @param data
 */
export function validateUserRegistrationInfo(data: User): ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    phone: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(6).max(20).required(),
    dateOfBirth: Joi.date().required(),
  });

  return schema.validate(data);
}

/**
 * Validate user login info (email, password)
 * @param data
 */
export function validateUserLoginInfo(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(data);
}

// Update user profile
export async function updateUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    // Validate incoming data
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(6).max(20).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id } = req.params;
    const updated = await userModel.findByIdAndUpdate(
      id,
      {
        name: value.name,
        email: value.email,
        phone: value.phone,
      },
      { new: true, select: "name email phone dateOfBirth isAdmin" }
    );

    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err });
  } finally {
    await disconnect();
  }
}

// Change password (requires currentPassword + newPassword)
export async function changeUserPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    // Validate payload
    const schema = Joi.object({
      currentPassword: Joi.string().min(6).max(255).required(),
      newPassword: Joi.string().min(6).max(255).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id } = req.params;
    const user = await userModel.findById(id).select("password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verify current password
    const match = await bcrypt.compare(value.currentPassword, user.password);
    if (!match) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(value.newPassword, salt);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err });
  } finally {
    await disconnect();
  }
}
