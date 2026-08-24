const express = require("express");

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Protected admin routes
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createVehicle
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateVehicle
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteVehicle
);

module.exports = router;