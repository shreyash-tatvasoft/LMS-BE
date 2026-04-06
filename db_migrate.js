// For Railway Setup Only

import mysql from "mysql2/promise";
import fs from "fs";

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

    console.log("🔹 Reading schema.sql...");
    const sql = fs.readFileSync("./migrations/schema.sql", "utf-8");

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