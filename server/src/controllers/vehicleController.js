const pool = require("../config/db");

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vehicles ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching vehicles:", error);

    res.status(500).json({
      message: "Failed to fetch vehicles",
    });
  }
};

// Get one vehicle
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM vehicles WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching vehicle:", error);

    res.status(500).json({
      message: "Failed to fetch vehicle",
    });
  }
};

// Add vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      engine,
      color,
      body_type,
      condition,
      description,
      location,
      status,
    } = req.body;

    if (!brand || !model || !year || !price) {
      return res.status(400).json({
        message: "Brand, model, year and price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO vehicles
      (
        brand,
        model,
        year,
        price,
        mileage,
        fuel_type,
        transmission,
        engine,
        color,
        body_type,
        condition,
        description,
        location,
        status
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        brand,
        model,
        year,
        price,
        mileage,
        fuel_type,
        transmission,
        engine,
        color,
        body_type,
        condition,
        description,
        location || "Addis Ababa",
        status || "AVAILABLE",
      ]
    );

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);

    res.status(500).json({
      message: "Failed to create vehicle",
    });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      engine,
      color,
      body_type,
      condition,
      description,
      location,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE vehicles
       SET
         brand = $1,
         model = $2,
         year = $3,
         price = $4,
         mileage = $5,
         fuel_type = $6,
         transmission = $7,
         engine = $8,
         color = $9,
         body_type = $10,
         condition = $11,
         description = $12,
         location = $13,
         status = $14,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        brand,
        model,
        year,
        price,
        mileage,
        fuel_type,
        transmission,
        engine,
        color,
        body_type,
        condition,
        description,
        location,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);

    res.status(500).json({
      message: "Failed to update vehicle",
    });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM vehicles WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);

    res.status(500).json({
      message: "Failed to delete vehicle",
    });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};