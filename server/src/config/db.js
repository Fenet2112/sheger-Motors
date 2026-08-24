const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
const isSupabase = connectionString?.includes("supabase.com");

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;