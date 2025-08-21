import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";
import assignBook from "./routes/assigned-books.routes"
import cors from "cors"
import { db } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// app.use(cors())

app.use(
  cors({
    origin: "*",  // your Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    // credentials: true, //  allow cookies/auth headers
  })
);

app.use(express.json());

// sample data
app.get("/", async (req, res) => {
    const connection = await db.getConnection();
    connection.release();
    return res.send({ "message" : "Welcome to LMS App that is Connected to MySQL on EC2"})
});

// Function to test DB connection
const dbConnect = async () => {
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
app.use("/api/assigned-books", assignBook)

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await dbConnect();
});
