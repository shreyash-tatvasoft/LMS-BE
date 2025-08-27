import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";
import assignBook from "./routes/assigned-books.routes"
import cors from "cors"
import { db } from "./config/db";
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to log every request
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    });
  });

  next();
});


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
app.get("/", (req, res) => {
    logger.info("Index API Logs....")
    return res.send({ "message" : "Welcome to LMS App"})
});

app.get("/db-check", async (req, res) => {
  try {
    const pool = await db;
    const connection = await pool.getConnection();
    connection.release();
    return res.send({ 
      status: "success",
      message: "Successfully connected to Database" 
    });
  } catch (err: any) {
    console.error("DB connection failed on /db-check route:");
    console.error("Error code:", err.code);        // e.g., ECONNREFUSED
    console.error("Error message:", err.message); // descriptive message
    console.error("Stack trace:", err.stack);     // full stack trace
    return res.status(500).send({ 
      status: "error",
      code: err.code,
      message: err.message
    });
  }
});



// Function to test DB connection
const dbConnect = async () => {
  try {
    const pool = await db;
    const connection = await pool.getConnection();
    console.log("Connected to Database");
    connection.release();
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/assigned-books", assignBook)

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await dbConnect();
});
