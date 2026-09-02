const pool = require("../src/config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const createAdmin = async () => {
  try {
    const name = "Sheger Motors Admin";
    const email = "fenufen491@gmail.com";
    const password = "ChangeThisPassword123!";

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)`,
      [name, email, hashedPassword, "admin"]
    );

    console.log("Admin account created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();