// For Railway Setup Only

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  try {
    console.log("🔹 Connecting to DB...");

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    // FIX: absolute path using process.cwd()
    const filePath = path.join(process.cwd(), "migrations", "schema.sql");

    console.log("🔹 Reading schema.sql from:", filePath);

    const sql = fs.readFileSync(filePath, "utf-8");

    console.log("🔹 Running migrations...");
    await connection.query(sql);

    console.log("Migration completed successfully!");

    await connection.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();