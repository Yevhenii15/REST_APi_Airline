import { Request, Response } from "express";
import { aboutModel } from "../models/aboutModel";
import { connect, disconnect } from "../database/database";

/**
 * Update company information.
 */
export const updateCompanyInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await connect();

    const { description, address, phone, email } = req.body;
    if (!description || !address || !phone || !email) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Find existing company info
    const existingCompany = await aboutModel.findOne();
    if (!existingCompany) {
      res
        .status(404)
        .json({
          error: "Company information not found. Update is not possible.",
        });
      return;
    }

    // Update existing company info
    existingCompany.description = description;
    existingCompany.address = address;
    existingCompany.phone = phone;
    existingCompany.email = email;

    await existingCompany.save();

    res
      .status(200)
      .json({
        message: "Company information updated",
        company: existingCompany,
      });
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
