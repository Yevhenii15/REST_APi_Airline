import { Router } from "express";
import { checkInTicket } from "../controllers/checkInController";

import { verifyLoggedIn } from "../controllers/userController";

const router: Router = Router();
/**
 * @swagger
 * /check-in/{ticketId}:
 *   post:
 *     summary: Check-in for a flight using the ticket ID
 *     description: This route allows a logged-in user to check-in for a flight by providing the ticket ID.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: The ID of the ticket to check-in
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket successfully checked-in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket successfully checked-in"
 *       401:
 *         description: Unauthorized (User not logged in)
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []  # Assuming JWT Bearer Authentication is being used
 */
router.post("/:ticketId", verifyLoggedIn, checkInTicket);

export default router;
