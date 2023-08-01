import { Request, Response } from "express";
import { loginService, registerService } from "../services/user.service";
import { generateToken } from "../middleware/auth";
import dotenv from "dotenv";

dotenv.config();

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ error: "Username, email, and password are required" });
  }

  try {
    const result = await registerService(username, email, password);
    return res
      .status(201)
      .send({ message: "Registration successful", data: result });
  } catch (error: any) {
    console.error("Error registering user:", error.message);
    return res
      .status(500)
      .send({ error: "An error occurred during registration" });
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    const result = await loginService(username, password);

    if (!result) {
      return res.status(401).send({ error: "Invalid username/password" });
    }

    const token = generateToken({ data: username });
    return res
      .status(200)
      .send({ message: "Login successful", data: { ...result, token } });
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    return res.status(500).send({ error: "An error occurred during login" });
  }
}
