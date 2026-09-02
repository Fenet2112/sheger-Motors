import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { createVehicle, uploadVehicleImage } from "../services/api";
import VehiclePhotoUploader from "../components/VehiclePhotoUploader";

// ── Select options ─────────────────────────────────────────────────────────────
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Pickup", "Minivan", "Wagon", "Coupe", "Van"];
const CONDITIONS = ["New", "Used"];
const STATUSES = ["AVAILABLE", "SOLD", "RESERVED"];

const emptyForm = {
  brand: "", model: "", year: "", price: "", mileage: "",
  fuel_type: "Petrol", transmission: "Automatic", engine: "",
  color: "", body_type: "Sedan", condition: "Used",
  description: "", location: "Addis Ababa", status: "AVAILABLE",
};

export default function AdminAddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.brand || !formData.model || !formData.year || !formData.price) {
      setSnackbar({ open: true, message: "Please fill in Brand, Model, Year, and Price.", severity: "error" });
      return;
    }

    try {
      setUploadProgress("Creating vehicle...");
      const res = await createVehicle(formData);
      const created = res.data.vehicle;

      if (selectedPhotos.length > 0) {
        let uploaded = 0;
        let failed = 0;
        for (let i = 0; i < selectedPhotos.length; i++) {
          try {
            setUploadProgress(`Uploading photo ${i + 1} of ${selectedPhotos.length}...`);
            await uploadVehicleImage(created.id, selectedPhotos[i]);
            uploaded++;
          } catch {
            failed++;
          }
        }
        if (failed === 0) {
          setSnackbar({ open: true, message: `Vehicle added with ${uploaded} photo${uploaded !== 1 ? "s" : ""}.`, severity: "success" });
        } else if (uploaded > 0) {
          setSnackbar({ open: true, message: `Vehicle added. ${uploaded} photo${uploaded !== 1 ? "s" : ""} uploaded, ${failed} failed.`, severity: "warning" });
        } else {
          setSnackbar({ open: true, message: "Vehicle added, but photo uploads failed.", severity: "warning" });
        }
      } else {
        setSnackbar({ open: true, message: "Vehicle added successfully.", severity: "success" });
      }

      // Navigate to vehicles list after a brief pause so the snackbar is seen
      setTimeout(() => navigate("/admin/vehicles"), 1500);
    } catch (error) {
      setUploadProgress(null);
      const msg = error.response?.data?.message || "Failed to add vehicle.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const isBusy = Boolean(uploadProgress);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/vehicles")}
        sx={{ mb: 2 }}
        disabled={isBusy}
      >
        Back to Vehicles
      </Button>

      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Add New Vehicle
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              {/* Required fields */}
              <Grid item xs={12} sm={6}>
                <TextField label="Brand" name="brand" value={formData.brand} onChange={handleChange} fullWidth size="small" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Model" name="model" value={formData.model} onChange={handleChange} fullWidth size="small" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Year" name="year" type="number" value={formData.year} onChange={handleChange} fullWidth size="small" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth size="small" required />
              </Grid>

              {/* Optional fields */}
              <Grid item xs={12} sm={6}>
                <TextField label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Engine" name="engine" value={formData.engine} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Color" name="color" value={formData.color} onChange={handleChange} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth size="small" />
              </Grid>

              {/* Selects */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fuel Type</InputLabel>
                  <Select label="Fuel Type" name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                    {FUEL_TYPES.map((ft) => <MenuItem key={ft} value={ft}>{ft}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Transmission</InputLabel>
                  <Select label="Transmission" name="transmission" value={formData.transmission} onChange={handleChange}>
                    {TRANSMISSIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Body Type</InputLabel>
                  <Select label="Body Type" name="body_type" value={formData.body_type} onChange={handleChange}>
                    {BODY_TYPES.map((bt) => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Condition</InputLabel>
                  <Select label="Condition" name="condition" value={formData.condition} onChange={handleChange}>
                    {CONDITIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" name="status" value={formData.status} onChange={handleChange}>
                    {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth size="small" multiline rows={3} />
              </Grid>

              {/* Photos */}
              <Grid item xs={12}>
                <VehiclePhotoUploader
                  selectedFiles={selectedPhotos}
                  onFilesChange={setSelectedPhotos}
                  onRemove={(index) => setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))}
                  maxFiles={10}
                  maxSize={5}
                />
              </Grid>

              {/* Progress */}
              {uploadProgress && (
                <Grid item xs={12}>
                  <Alert severity="info" icon={<CircularProgress size={16} />}>
                    {uploadProgress}
                  </Alert>
                </Grid>
              )}

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/admin/vehicles")}
                    disabled={isBusy}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isBusy}
                  >
                    {isBusy ? "Saving..." : "Add Vehicle"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
