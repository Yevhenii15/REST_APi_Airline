import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../controllers/userController";
import { verifyLoggedIn } from "../controllers/userController";

const router: Router = Router();

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User Routes
 *     summary: Get user profile
 *     description: Fetches the user profile by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get("/:id", verifyLoggedIn, getUserProfile);

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Registers a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login user
 *     description: Authenticates a user and returns a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request (missing or incorrect fields)
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     tags:
 *       - User Routes
 *     summary: Update user profile
 *     description: Updates the user profile by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.put("/:id", verifyLoggedIn, updateUserProfile);

/**
 * @swagger
 * /user/{id}/password:
 *   patch:
 *     tags:
 *       - User Routes
 *     summary: Change user password
 *     description: Changes the password of the user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword"
 */
router.patch("/:id/password", verifyLoggedIn, changeUserPassword);

export default router;
