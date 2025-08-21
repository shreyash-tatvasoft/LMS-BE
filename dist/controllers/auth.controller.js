"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const db_1 = require("../config/db");
const password_1 = require("../utils/password");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function register(req, res) {
    try {
        const { fullName, email, password, dob, role } = req.body;
        const [existing] = await db_1.db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }
        const hashed = await (0, password_1.hashPassword)(password);
        await db_1.db.query("INSERT INTO users (fullName, email, password, dob, role) VALUES (?, ?, ?, ?, ?)", [fullName, email, hashed, dob, role || "STUDENT"]);
        return res.status(201).json({ success: true, message: "Registered successfully" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const [rows] = await db_1.db.query("SELECT * FROM users WHERE email = ?", [email]);
        const users = rows;
        if (users.length === 0)
            return res.status(404).json({ message: "Invalid credentials" });
        const user = users[0];
        const ok = await (0, password_1.comparePassword)(password, user.password);
        if (!ok)
            return res.status(404).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({ success: true, token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
