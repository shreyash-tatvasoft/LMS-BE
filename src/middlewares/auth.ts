import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getJWTSecret } from "../utils/helper";

dotenv.config();

export interface JwtPayload {
  id: number;
  role: "ADMIN" | "STUDENT";
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["token"] as string;
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const jwtSecret = await getJWTSecret();
    const decoded = jwt.verify(token, jwtSecret!) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
