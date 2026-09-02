/**
 * Updates the admin account email from the old demo address
 * to the new real address.
 *
 * Usage:
 *   cd server
 *   node scripts/updateAdminEmail.js
 */
require("dotenv").config();
const pool = require("../src/config/db");

const OLD_EMAIL = "admin@shegermotors.com";
const NEW_EMAIL = "fenufen491@gmail.com";

async function run() {
  try {
    // Check if old email exists
    const existing = await pool.query(
      "SELECT id, email, role FROM users WHERE email = $1",
      [OLD_EMAIL]
    );

    if (existing.rows.length === 0) {
      // Maybe already updated — check for new email
      const alreadyUpdated = await pool.query(
        "SELECT id, email, role FROM users WHERE email = $1",
        [NEW_EMAIL]
      );

      if (alreadyUpdated.rows.length > 0) {
        console.log("✅ Email already updated. Current admin account:");
        console.log("   ID:   ", alreadyUpdated.rows[0].id);
        console.log("   Email:", alreadyUpdated.rows[0].email);
        console.log("   Role: ", alreadyUpdated.rows[0].role);
      } else {
        console.log("⚠️  No admin account found with either email address.");
        console.log("   Run: node scripts/createAdmin.js  to create one first.");
      }
      return;
    }

    const admin = existing.rows[0];

    // Check the new email isn't already taken by a different account
    const conflict = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [NEW_EMAIL, admin.id]
    );

    if (conflict.rows.length > 0) {
      console.error("❌ Another account already uses:", NEW_EMAIL);
      console.error("   No changes were made.");
      process.exit(1);
    }

    // Perform the update — only email changes, password and role are untouched
    await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2",
      [NEW_EMAIL, admin.id]
    );

    console.log("✅ Admin email updated successfully.");
    console.log("   ID:        ", admin.id);
    console.log("   Old email: ", OLD_EMAIL);
    console.log("   New email: ", NEW_EMAIL);
    console.log("   Role:      ", admin.role);
    console.log("   Password:   unchanged");
  } catch (err) {
    console.error("❌ Update failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
