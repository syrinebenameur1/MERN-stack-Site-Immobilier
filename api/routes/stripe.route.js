import express from "express";
import { createCheckoutSession, handlePaymentSuccess } from "../controllers/stripe.controller.js";

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
// Dans stripeRoute.js
router.get('/success/:sessionId', handlePaymentSuccess);

export default router;
