import { verifyUserRequest } from "../middleware/auth";
import { createCheckoutSession, createPortalSession } from "../controllers/stripe.controller";
import { login, register } from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/create-checkout-session", verifyUserRequest, createCheckoutSession);
router.post("/create-portal-session", verifyUserRequest, createPortalSession);

export default router;
