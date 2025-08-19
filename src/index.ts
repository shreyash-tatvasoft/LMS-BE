import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";
import { db } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// sample data
app.get("/", (req, res) => {
    return res.send({ "message" : "Welcome to LMS App"})
});

// Separate function to test DB connection
const testDBConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL on EC2");
    connection.release();
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
};

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await testDBConnection(); // test DB only after server starts
});
