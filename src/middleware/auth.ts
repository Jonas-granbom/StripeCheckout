import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET!;

export const generateToken = (payload: {}, expiresIn: number = 2592000) => {
  return sign(payload, secret, { expiresIn });
};
export const verifyToken = (token: string): any => {
  return verify(token, secret);
};

export async function verifyUserRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = auth.split("Bearer ")[1];
    const tokenData = await verifyToken(token);
    const username = tokenData.data;

    if (!username) {
      throw new Error("Invalid token");
    }

    req.body.username = username;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
}
