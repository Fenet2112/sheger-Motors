import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
} from "../services/api";
import { formatPrice } from "../utils/format";
import VehiclePhotoUploader from "../components/VehiclePhotoUploader";

// ── Empty form template ──────────────────────────────────────────────────────
const emptyForm = {
  brand: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  fuel_type: "Petrol",
  transmission: "Automatic",
  engine: "",
  color: "",
  body_type: "Sedan",
  condition: "Used",
  description: "",
  location: "Addis Ababa",
  status: "AVAILABLE",
};

// ── Select options ────────────────────────────────────────────────────────────
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Pickup",
  "Minivan",
  "Wagon",
  "Coupe",
  "Van",
];
const CONDITIONS = ["New", "Used"];
const STATUSES = ["AVAILABLE", "SOLD"];

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ── Vehicle list state ──────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Add / Edit dialog state ─────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = add, number = edit
  const [formData, setFormData] = useState(emptyForm);
  const [selectedPhotos, setSelectedPhotos] = useState([]); // Selected photo files
  const [uploadProgress, setUploadProgress] = useState(null); // Upload status message

  // ── Delete confirmation state ───────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // vehicle object

  // ── Snackbar state ──────────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ── Fetch vehicles on mount ─────────────────────────────────────────────────
  useEffect(() => {
    getVehicles()
      .then((res) => setVehicles(res.data))
      .catch(() => setFetchError("Failed to load vehicles. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  // ── Form helpers ────────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setSelectedPhotos([]);
    setUploadProgress(null);
    setDialogOpen(true);
  };

  const openEditDialog = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      brand: vehicle.brand ?? "",
      model: vehicle.model ?? "",
      year: vehicle.year ?? "",
      price: vehicle.price ?? "",
      mileage: vehicle.mileage ?? "",
      fuel_type: vehicle.fuel_type ?? "Petrol",
      transmission: vehicle.transmission ?? "Automatic",
      engine: vehicle.engine ?? "",
      color: vehicle.color ?? "",
      body_type: vehicle.body_type ?? "Sedan",
      condition: vehicle.condition ?? "Used",
      description: vehicle.description ?? "",
      location: vehicle.location ?? "Addis Ababa",
      status: vehicle.status ?? "AVAILABLE",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setSelectedPhotos([]);
    setUploadProgress(null);
  };

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      // ── FRONTEND VALIDATION ──
      if (!formData.brand || !formData.model || !formData.year || !formData.price) {
        showSnackbar(
          "Please fill in all required fields: Brand, Model, Year, and Price.",
          "error"
        );
        return;
      }

      if (editingId === null) {
        // ── ADD VEHICLE ──
        setUploadProgress("Creating vehicle...");
        const res = await createVehicle(formData);
        const created = res.data.vehicle; // Backend returns { message, vehicle }

        // Upload photos if any were selected
        if (selectedPhotos.length > 0) {
          const vehicleId = created.id;
          let uploadedCount = 0;
          const failedUploads = [];

          for (let i = 0; i < selectedPhotos.length; i++) {
            try {
              setUploadProgress(
                `Uploading photo ${i + 1} of ${selectedPhotos.length}...`
              );
              await uploadVehicleImage(vehicleId, selectedPhotos[i]);
              uploadedCount++;
            } catch (error) {
              console.error(`Failed to upload photo ${i + 1}:`, error);
              failedUploads.push(i + 1);
            }
          }

          // Show appropriate success/warning message
          if (failedUploads.length === 0) {
            showSnackbar(
              `Vehicle added successfully with ${uploadedCount} photo${
                uploadedCount !== 1 ? "s" : ""
              }.`,
              "success"
            );
          } else if (uploadedCount > 0) {
            showSnackbar(
              `Vehicle added. ${uploadedCount} photo${
                uploadedCount !== 1 ? "s" : ""
              } uploaded, but ${failedUploads.length} failed.`,
              "warning"
            );
          } else {
            showSnackbar(
              "Vehicle added, but photo uploads failed.",
              "warning"
            );
          }
        } else {
          showSnackbar("Vehicle added successfully.", "success");
        }

        setVehicles((prev) => [...prev, created]);
      } else {
        // ── EDIT VEHICLE ──
        const res = await updateVehicle(editingId, formData);
        const updated = res.data.vehicle; // Backend returns { message, vehicle }
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingId ? updated : v))
        );
        showSnackbar("Vehicle updated successfully.", "success");
      }
      closeDialog();
    } catch (error) {
      console.error("Submit error:", error);
      setUploadProgress(null);
      
      // Show specific error message from backend if available
      const errorMessage = error.response?.data?.message || 
        (editingId === null ? "Failed to add vehicle." : "Failed to update vehicle.");
      
      showSnackbar(errorMessage, "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteVehicle(deleteTarget.id);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      showSnackbar("Vehicle deleted successfully.", "success");
    } catch {
      showSnackbar("Failed to delete vehicle.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Snackbar helpers ────────────────────────────────────────────────────────
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ── Photo upload helpers ────────────────────────────────────────────────────
  const handlePhotosChange = (files) => {
    setSelectedPhotos(files);
  };

  const handlePhotoRemove = (index) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ paddingTop: "64px", px: 3, pb: 4 }}>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Admin Dashboard
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            Vehicle Management
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* ── Loading / error states ─────────────────────────────────────────── */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      {!loading && !fetchError && (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Add Vehicle
            </Button>
          </Box>

          {/* ── Vehicles table ─────────────────────────────────────────────── */}
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((v) => (
                    <TableRow key={v.id} hover>
                      <TableCell>{v.id}</TableCell>
                      <TableCell>{v.brand}</TableCell>
                      <TableCell>{v.model}</TableCell>
                      <TableCell>{v.year}</TableCell>
                      <TableCell>{formatPrice(v.price)}</TableCell>
                      <TableCell>{v.condition}</TableCell>
                      <TableCell>{v.status}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => openEditDialog(v)}
                          aria-label={`Edit ${v.brand} ${v.model}`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(v)}
                          aria-label={`Delete ${v.brand} ${v.model}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── Add / Edit dialog ─────────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          {editingId === null ? "Add Vehicle" : "Edit Vehicle"}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Brand */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>

            {/* Model */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>

            {/* Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>

            {/* Mileage */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Engine */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Engine"
                name="engine"
                value={formData.engine}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Color */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Fuel Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  label="Fuel Type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleFormChange}
                >
                  {FUEL_TYPES.map((ft) => (
                    <MenuItem key={ft} value={ft}>
                      {ft}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Transmission */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Transmission</InputLabel>
                <Select
                  label="Transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleFormChange}
                >
                  {TRANSMISSIONS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Body Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Body Type</InputLabel>
                <Select
                  label="Body Type"
                  name="body_type"
                  value={formData.body_type}
                  onChange={handleFormChange}
                >
                  {BODY_TYPES.map((bt) => (
                    <MenuItem key={bt} value={bt}>
                      {bt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Condition */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Condition</InputLabel>
                <Select
                  label="Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleFormChange}
                >
                  {CONDITIONS.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                fullWidth
                size="small"
                multiline
                rows={3}
              />
            </Grid>

            {/* Vehicle Photos Section - Only show when adding a new vehicle */}
            {editingId === null && (
              <Grid item xs={12}>
                <VehiclePhotoUploader
                  selectedFiles={selectedPhotos}
                  onFilesChange={handlePhotosChange}
                  onRemove={handlePhotoRemove}
                  maxFiles={10}
                  maxSize={5}
                />
              </Grid>
            )}

            {/* Upload progress indicator */}
            {uploadProgress && (
              <Grid item xs={12}>
                <Alert severity="info">{uploadProgress}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} disabled={Boolean(uploadProgress)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={Boolean(uploadProgress)}
          >
            {editingId === null ? "Add Vehicle" : "Save Vehicle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── Delete confirmation dialog ────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deleteTarget?.brand} {deleteTarget?.model}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── Snackbar ──────────────────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
