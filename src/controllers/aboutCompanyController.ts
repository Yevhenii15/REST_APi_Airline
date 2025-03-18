import { Request, Response } from "express";
import { aboutModel } from "../models/aboutModel"; // Import About model
import { connect, disconnect } from "../database/database";

/**
 * Create or update company information.
 */
export const createOrUpdateCompanyInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await connect();

    const { name, description, address, phone, email } = req.body;
    if (!name || !description || !address || !phone || !email) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const companyInfo = { name, description, address, phone, email };

    const updatedCompanyInfo = await aboutModel.findOneAndUpdate(
      { name }, // Match by company name
      companyInfo, // Update fields
      { upsert: true, new: true, runValidators: true } // Upsert option
    );

    res
      .status(200)
      .json({ message: "Company information updated", company: updatedCompanyInfo });
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
 * Retrieve company information.
 */
export const getCompanyInfo = async (req: Request, res: Response) => {
  try {
    await connect();
    const companyInfo = await aboutModel.findOne();
    if (!companyInfo) {
      res.status(404).json({ error: "Company information not found" });
      return;
    }
    res.status(200).json(companyInfo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await disconnect();
  }
};