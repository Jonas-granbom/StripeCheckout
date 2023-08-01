import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import dotenv from "dotenv";
import { dbContext } from "../server";

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function loginService(
  username: string,
  password: string
): Promise<any> {
  username = username.toLowerCase();
  const userRepository = dbContext.getRepository(User);

  const user = await userRepository.findOne({ where: { username } });

  if (user && bcrypt.compareSync(password, user.password)) {
    return { ...user };
  } else {
    throw new Error("Invalid username/password or User not found");
  }
}

export async function registerService(
  username: string,
  email: string,
  password: string
): Promise<any> {
  if (!username || !email || !password) {
    throw new Error("Username, email, and password are required");
  }

  const userRepository = dbContext.getRepository(User);

  const existingUser = await userRepository.findOne({
    where: [{ email }, { username: username.toLowerCase() }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already exists");
    } else {
      throw new Error("Username already exists");
    }
  }

  const user = userRepository.create({
    username: username.toLowerCase(),
    email,
    password: bcrypt.hashSync(password, 10),
  });

  try {
    const stripeCustomerData = {
      email: user.email,
    };
    const stripeCustomer = await stripe.customers.create(stripeCustomerData);
    user.stripeCustomerId = stripeCustomer.id;
    await userRepository.save(user);
    console.log(
      "Stripe customer created and ID saved to user:",
      stripeCustomer.id
    );
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }

  return user;
}
