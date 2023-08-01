import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req: Request, res: Response) {
  const { price_id, mode, stripe_customer_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: price_id, quantity: 1 }],
      mode: mode,
      customer: stripe_customer_id,
      success_url: `https://checkout.stripe.dev/success`, //Not yet implemented
      cancel_url: `https://checkout.stripe.dev/cancel`, //Not yet implemented
    });

    res.json({ session });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "An error occurred during checkout." });
  }
}

export async function createPortalSession(req: Request, res: Response) {
  try {
    const { stripe_customer_id } = req.body;

    const returnUrl = `http://${process.env.HOST}:${process.env.PORT}`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_id,
      return_url: returnUrl,
    });

    res.json({ portalSession });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({
      error: "An error occurred during redirection to Stripe customer portal.",
    });
  }
}
