import { Router } from "express";
import { checkInTicket } from "../controllers/checkinController";

import { verifyLoggedIn } from "../controllers/userController";

const router: Router = Router();

router.post("/:ticketId", verifyLoggedIn, checkInTicket);

export default router;
