/**
 * Run the settings migration:
 *   node scripts/runMigration.js
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pool = require("../src/config/db");

async function run() {
  const sql = fs.readFileSync(
    path.join(__dirname, "../database/settings_migration.sql"),
    "utf8"
  );

  try {
    await pool.query(sql);
    console.log("✅ Settings migration applied successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
