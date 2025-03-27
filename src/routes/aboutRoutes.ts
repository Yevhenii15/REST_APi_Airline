import { Router } from "express";
import {
  getCompanyInfo,
  updateCompanyInfo,
} from "../controllers/aboutCompanyController";
import { verifyAdmin } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /about/company:
 *   put:
 *     tags:
 *      - About Company
 *     summary: Update company information
 *     description: Updates the existing company information in the database. Creation of a new company is not allowed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - address
 *               - description
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: Successfully updated company information.
 *       400:
 *         description: All fields are required.
 *       404:
 *         description: Company information not found. Update is not possible.
 *       500:
 *         description: Internal server error.
 */
router.put("/company", verifyAdmin, updateCompanyInfo);

/**
 * @swagger
 * /about/company:
 *   get:
 *     tags:
 *      - About Company
 *     summary: Get company information
 *     description: Retrieves the company information from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved company information.
 *       404:
 *         description: Company information not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/company", getCompanyInfo);

export default router;
