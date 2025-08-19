import type { Request, Response } from "express";
import { db } from "../config/db";
import { hashPassword, comparePassword } from "../utils/password";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, password, dob, role } = req.body;

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await hashPassword(password);
    await db.query(
      "INSERT INTO users (fullName, email, password, dob, role) VALUES (?, ?, ?, ?, ?)",
      [fullName, email, hashed, dob, role || "STUDENT"]
    );

    return res.status(201).json({ message: "Registered successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const users = rows as any[];

    if (users.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = users[0];
    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}
