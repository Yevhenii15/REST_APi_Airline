import { Router } from "express";
import {
  createOrUpdateCompanyInfo,
  getCompanyInfo,
} from "../controllers/aboutCompanyController";

const router = Router();

/**
 * @swagger
 * /about/company:
 *   post:
 *     tags:
 *      - About Company
 *     summary: Create or update company information
 *     description: Creates or updates the company information in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *               - address
 *               - phone
 *               - email
 *     responses:
 *       200:
 *         description: Successfully created or updated company information.
 *       400:
 *         description: All fields are required.
 *       500:
 *         description: Internal server error.
 */
router.post("/company", createOrUpdateCompanyInfo);

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