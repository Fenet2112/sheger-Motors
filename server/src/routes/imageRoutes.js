const express = require("express");

const {
  uploadImage,
  getVehicleImages,
  deleteVehicleImage,
} = require("../controllers/imageController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public - get vehicle images
router.get("/:vehicleId", getVehicleImages);

// Admin - upload image
router.post(
  "/:vehicleId",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  uploadImage
);

// Admin - delete image
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteVehicleImage
);

module.exports = router;