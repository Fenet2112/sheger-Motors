const pool = require("../config/db");
const { uploadVehicleImage } = require("../services/imageService");

// Upload vehicle image
const uploadImage = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    // Check if vehicle exists
    const vehicle = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1",
      [vehicleId]
    );

    if (vehicle.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Upload image to Supabase
    const imageUrl = await uploadVehicleImage(
      req.file,
      vehicleId
    );

    // Save image URL in PostgreSQL
    const result = await pool.query(
      `INSERT INTO vehicle_images (vehicle_id, image_url)
       VALUES ($1, $2)
       RETURNING *`,
      [vehicleId, imageUrl]
    );

    res.status(201).json({
      message: "Vehicle image uploaded successfully",
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Image upload error:", error);

    res.status(500).json({
      message: "Failed to upload vehicle image",
    });
  }
};

// Get images for a vehicle
const getVehicleImages = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM vehicle_images
       WHERE vehicle_id = $1
       ORDER BY created_at ASC`,
      [vehicleId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching vehicle images:", error);

    res.status(500).json({
      message: "Failed to fetch vehicle images",
    });
  }
};

// Delete an image
const deleteVehicleImage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM vehicle_images WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.status(200).json({
      message: "Vehicle image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle image:", error);

    res.status(500).json({
      message: "Failed to delete vehicle image",
    });
  }
};

module.exports = {
  uploadImage,
  getVehicleImages,
  deleteVehicleImage,
};