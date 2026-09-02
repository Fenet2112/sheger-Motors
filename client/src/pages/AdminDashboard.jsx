import { useState, useEffect, useCallback, useRef } from "react";
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
  Card,
  CardContent,
  Skeleton,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SellIcon from "@mui/icons-material/Sell";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  getAdminStats,
  getVehicleImages,
  deleteVehicleImage,
} from "../services/api";
import { formatPrice } from "../utils/format";
import VehiclePhotoUploader from "../components/VehiclePhotoUploader";
import CurrentPhotos from "../components/admin/CurrentPhotos";

// ── Constants ─────────────────────────────────────────────────────────────────
const POLL_INTERVAL = 15000; // 15 seconds

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Pickup", "Minivan", "Wagon", "Coupe", "Van"];
const CONDITIONS = ["New", "Used"];
const STATUSES = ["AVAILABLE", "SOLD", "RESERVED"];

const STATUS_COLORS = {
  AVAILABLE: "#22c55e",
  SOLD: "#ef4444",
  RESERVED: "#f59e0b",
};

const BRAND_CHART_COLORS = [
  "#0A1929", "#1565C0", "#F59E0B", "#22c55e",
  "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899",
];

const emptyForm = {
  brand: "", model: "", year: "", price: "", mileage: "",
  fuel_type: "Petrol", transmission: "Automatic", engine: "",
  color: "", body_type: "Sedan", condition: "Used",
  description: "", location: "Addis Ababa", status: "AVAILABLE",
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, loading }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={36} />
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                backgroundColor: `${color}18`,
                color,
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {label}
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.25 }}>
                {value}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const color = STATUS_COLORS[status] || "#64748b";
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: `${color}18`,
        color,
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 22,
      }}
    />
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {

  // ── Stats state ─────────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshError, setRefreshError] = useState(false); // silent refresh failure
  const pollingRef = useRef(null);

  // ── Vehicle list state ──────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  // ── Dialog state ────────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  // ── Edit-mode photo state ───────────────────────────────────────────────────
  const [existingPhotos, setExistingPhotos] = useState([]);    // photos from DB
  const [photosLoading, setPhotosLoading] = useState(false);   // loading skeleton
  const [deletingPhotoId, setDeletingPhotoId] = useState(null); // id being deleted

  // ── Delete dialog state ─────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Snackbar state ──────────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ── Fetch stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async (silent = false) => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
      setLastUpdated(new Date());
      setStatsError(null);
      setRefreshError(false);
    } catch {
      if (silent) {
        // Don't wipe existing data on a background poll failure
        setRefreshError(true);
      } else {
        setStatsError("Unable to load dashboard statistics.");
      }
    } finally {
      if (!silent) setStatsLoading(false);
    }
  }, []);

  // ── Fetch vehicle list ──────────────────────────────────────────────────────
  const fetchVehicles = useCallback(async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  // ── Initial load + polling ──────────────────────────────────────────────────
  useEffect(() => {
    fetchStats(false);
    fetchVehicles();

    pollingRef.current = setInterval(() => fetchStats(true), POLL_INTERVAL);
    return () => clearInterval(pollingRef.current);
  }, [fetchStats, fetchVehicles]);

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
    setSelectedPhotos([]);
    setUploadProgress(null);
    setExistingPhotos([]);
    setDeletingPhotoId(null);
    setDialogOpen(true);

    // Fetch existing photos
    setPhotosLoading(true);
    getVehicleImages(vehicle.id)
      .then((res) => setExistingPhotos(res.data))
      .catch(() => setExistingPhotos([]))
      .finally(() => setPhotosLoading(false));
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setSelectedPhotos([]);
    setUploadProgress(null);
    setExistingPhotos([]);
    setDeletingPhotoId(null);
    setPhotosLoading(false);
  };

  // ── Submit (add / edit) ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.year || !formData.price) {
      showSnackbar("Please fill in Brand, Model, Year, and Price.", "error");
      return;
    }

    try {
      if (editingId === null) {
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
            showSnackbar(`Vehicle added with ${uploaded} photo${uploaded !== 1 ? "s" : ""}.`, "success");
          } else if (uploaded > 0) {
            showSnackbar(`Vehicle added. ${uploaded} photo${uploaded !== 1 ? "s" : ""} uploaded, ${failed} failed.`, "warning");
          } else {
            showSnackbar("Vehicle added, but photo uploads failed.", "warning");
          }
        } else {
          showSnackbar("Vehicle added successfully.", "success");
        }

        setVehicles((prev) => [created, ...prev]);
      } else {
        // ── EDIT VEHICLE ──
        setUploadProgress("Saving vehicle...");
        const res = await updateVehicle(editingId, formData);
        const updated = res.data.vehicle;
        setVehicles((prev) => prev.map((v) => (v.id === editingId ? updated : v)));

        // Upload any newly selected photos
        if (selectedPhotos.length > 0) {
          let uploaded = 0;
          let failed = 0;
          for (let i = 0; i < selectedPhotos.length; i++) {
            try {
              setUploadProgress(`Uploading photo ${i + 1} of ${selectedPhotos.length}...`);
              await uploadVehicleImage(editingId, selectedPhotos[i]);
              uploaded++;
            } catch {
              failed++;
            }
          }
          if (failed === 0) {
            showSnackbar(`Vehicle updated with ${uploaded} new photo${uploaded !== 1 ? "s" : ""}.`, "success");
          } else if (uploaded > 0) {
            showSnackbar(`Vehicle updated. ${uploaded} photo${uploaded !== 1 ? "s" : ""} uploaded, ${failed} failed.`, "warning");
          } else {
            showSnackbar("Vehicle updated, but new photo uploads failed.", "warning");
          }
        } else {
          showSnackbar("Vehicle updated successfully.", "success");
        }
      }

      closeDialog();
      // Refresh stats immediately after any change
      fetchStats(true);
    } catch (error) {
      setUploadProgress(null);
      const msg = error.response?.data?.message ||
        (editingId === null ? "Failed to add vehicle." : "Failed to update vehicle.");
      showSnackbar(msg, "error");
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteVehicle(deleteTarget.id);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      showSnackbar("Vehicle deleted successfully.", "success");
      fetchStats(true);
    } catch {
      showSnackbar("Failed to delete vehicle.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Snackbar ────────────────────────────────────────────────────────────────
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // ── Photo helpers ───────────────────────────────────────────────────────────
  const handlePhotosChange = (files) => setSelectedPhotos(files);
  const handlePhotoRemove = (index) =>
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));

  // ── Delete an existing vehicle photo ────────────────────────────────────────
  const handleDeleteExistingPhoto = async (imageId) => {
    setDeletingPhotoId(imageId);
    try {
      await deleteVehicleImage(imageId);
      setExistingPhotos((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      showSnackbar("Failed to remove photo. Please try again.", "error");
    } finally {
      setDeletingPhotoId(null);
    }
  };

  // ── Derived chart data ──────────────────────────────────────────────────────
  const statusPieData = stats
    ? [
        { name: "Available", value: stats.totals.available, color: STATUS_COLORS.AVAILABLE },
        { name: "Sold", value: stats.totals.sold, color: STATUS_COLORS.SOLD },
        { name: "Reserved", value: stats.totals.reserved, color: STATUS_COLORS.RESERVED },
      ].filter((d) => d.value > 0)
    : [];

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ pb: 4 }}>

      {/* ── Silent refresh error banner ──────────────────────────────────────── */}
      {refreshError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setRefreshError(false)}>
          Unable to refresh — showing last available data.
        </Alert>
      )}

      {/* ── Live indicator + last updated ────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FiberManualRecordIcon sx={{ fontSize: 10, color: "#22c55e" }} />
          <Typography variant="caption" sx={{ color: "#22c55e", fontWeight: 600 }}>Live</Typography>
          {lastUpdatedLabel && (
            <Typography variant="caption" color="text.secondary">
              · Last updated: {lastUpdatedLabel}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh stats">
            <IconButton onClick={() => fetchStats(false)} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={() => window.open("/", "_blank")}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            View Website
          </Button>
        </Box>
      </Box>

      {/* ── Stats error state ────────────────────────────────────────────────── */}
      {statsError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchStats(false)}>
              Retry
            </Button>
          }
        >
          {statsError}
        </Alert>
      )}

      {/* ── Stat Cards Row 1 ─────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            loading={statsLoading}
            icon={<DirectionsCarIcon />}
            label="Total Vehicles"
            value={stats?.totals.vehicles ?? 0}
            color="#1565C0"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            loading={statsLoading}
            icon={<CheckCircleOutlineIcon />}
            label="Available"
            value={stats?.totals.available ?? 0}
            color={STATUS_COLORS.AVAILABLE}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            loading={statsLoading}
            icon={<SellIcon />}
            label="Sold"
            value={stats?.totals.sold ?? 0}
            color={STATUS_COLORS.SOLD}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            loading={statsLoading}
            icon={<BookmarkIcon />}
            label="Reserved"
            value={stats?.totals.reserved ?? 0}
            color={STATUS_COLORS.RESERVED}
          />
        </Grid>
      </Grid>

      {/* ── Stat Cards Row 2 ─────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <StatCard
            loading={statsLoading}
            icon={<AccountBalanceWalletIcon />}
            label="Total Inventory Value"
            value={stats ? formatPrice(stats.totals.totalValue) : "—"}
            color="#7c3aed"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            loading={statsLoading}
            icon={<TrendingUpIcon />}
            label="Average Vehicle Price"
            value={stats ? formatPrice(stats.totals.averagePrice) : "—"}
            color="#0891b2"
          />
        </Grid>
      </Grid>

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      {!statsError && (
        <>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Inventory Overview
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Status Pie Chart */}
            <Grid item xs={12} md={5}>
              <Card elevation={2} sx={{ borderRadius: 2, height: 280 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                    Inventory by Status
                  </Typography>
                  {statsLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                      <Skeleton variant="circular" width={160} height={160} />
                    </Box>
                  ) : statusPieData.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                      <Typography color="text.secondary" variant="body2">No data available</Typography>
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={210}>
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend
                          formatter={(value, entry) => (
                            <span style={{ fontSize: "0.8rem" }}>
                              {value} ({entry.payload.value})
                            </span>
                          )}
                        />
                        <RechartsTooltip formatter={(value, name) => [value, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Brand Bar Chart */}
            <Grid item xs={12} md={7}>
              <Card elevation={2} sx={{ borderRadius: 2, height: 280 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                    Vehicles by Brand
                  </Typography>
                  {statsLoading ? (
                    <Box sx={{ pt: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={20} sx={{ mb: 1, borderRadius: 0.5 }} />
                      ))}
                    </Box>
                  ) : !stats?.byBrand?.length ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                      <Typography color="text.secondary" variant="body2">No data available</Typography>
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={210}>
                      <BarChart data={stats.byBrand} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="brand" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <RechartsTooltip />
                        <Bar dataKey="count" name="Vehicles" radius={[4, 4, 0, 0]}>
                          {stats.byBrand.map((_, index) => (
                            <Cell key={index} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* ── Recently Added ───────────────────────────────────────────────────── */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Recently Added Vehicles
      </Typography>
      <Card elevation={2} sx={{ borderRadius: 2, mb: 4 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, backgroundColor: "#f8fafc" } }}>
                <TableCell>Vehicle</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Date Added</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statsLoading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={70} height={22} /></TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}><Skeleton variant="text" width={90} /></TableCell>
                  </TableRow>
                ))
              ) : !stats?.recentVehicles?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No vehicles yet.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentVehicles.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {v.brand} {v.model}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {v.year} · {v.condition}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {formatPrice(v.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={v.status} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(v.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Full Inventory Table ─────────────────────────────────────────────── */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }} id="inventory-section">
        All Vehicles
      </Typography>
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, backgroundColor: "#f8fafc" } }}>
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
              {vehiclesLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(9)].map((__, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No vehicles found. Click "Add Vehicle" to get started.
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
                    <TableCell><StatusChip status={v.status} /></TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => openEditDialog(v)} aria-label={`Edit ${v.brand} ${v.model}`}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(v)} aria-label={`Delete ${v.brand} ${v.model}`}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Add / Edit Dialog ────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>{editingId === null ? "Add Vehicle" : "Edit Vehicle"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField label="Brand" name="brand" value={formData.brand} onChange={handleFormChange} fullWidth size="small" required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Model" name="model" value={formData.model} onChange={handleFormChange} fullWidth size="small" required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Year" name="year" type="number" value={formData.year} onChange={handleFormChange} fullWidth size="small" required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Price" name="price" type="number" value={formData.price} onChange={handleFormChange} fullWidth size="small" required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleFormChange} fullWidth size="small" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Engine" name="engine" value={formData.engine} onChange={handleFormChange} fullWidth size="small" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Color" name="color" value={formData.color} onChange={handleFormChange} fullWidth size="small" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Location" name="location" value={formData.location} onChange={handleFormChange} fullWidth size="small" /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small"><InputLabel>Fuel Type</InputLabel>
                <Select label="Fuel Type" name="fuel_type" value={formData.fuel_type} onChange={handleFormChange}>
                  {FUEL_TYPES.map((ft) => <MenuItem key={ft} value={ft}>{ft}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small"><InputLabel>Transmission</InputLabel>
                <Select label="Transmission" name="transmission" value={formData.transmission} onChange={handleFormChange}>
                  {TRANSMISSIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small"><InputLabel>Body Type</InputLabel>
                <Select label="Body Type" name="body_type" value={formData.body_type} onChange={handleFormChange}>
                  {BODY_TYPES.map((bt) => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small"><InputLabel>Condition</InputLabel>
                <Select label="Condition" name="condition" value={formData.condition} onChange={handleFormChange}>
                  {CONDITIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small"><InputLabel>Status</InputLabel>
                <Select label="Status" name="status" value={formData.status} onChange={handleFormChange}>
                  {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" value={formData.description} onChange={handleFormChange} fullWidth size="small" multiline rows={3} />
            </Grid>

            {/* ── Add Vehicle: photo uploader ───────────────────────────────── */}
            {editingId === null && (
              <Grid item xs={12}>
                <VehiclePhotoUploader selectedFiles={selectedPhotos} onFilesChange={handlePhotosChange} onRemove={handlePhotoRemove} maxFiles={10} maxSize={5} />
              </Grid>
            )}

            {/* ── Edit Vehicle: current photos + add new photos ─────────────── */}
            {editingId !== null && (
              <>
                <Grid item xs={12}>
                  <CurrentPhotos
                    images={existingPhotos}
                    loading={photosLoading}
                    onDelete={handleDeleteExistingPhoto}
                    deletingId={deletingPhotoId}
                  />
                </Grid>
                <Grid item xs={12}>
                  <VehiclePhotoUploader
                    selectedFiles={selectedPhotos}
                    onFilesChange={handlePhotosChange}
                    onRemove={handlePhotoRemove}
                    maxFiles={Math.max(0, 10 - existingPhotos.length)}
                    maxSize={5}
                  />
                </Grid>
              </>
            )}

            {uploadProgress && (
              <Grid item xs={12}>
                <Alert severity="info">{uploadProgress}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={Boolean(uploadProgress)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={Boolean(uploadProgress)}>
            {editingId === null ? "Add Vehicle" : "Save Vehicle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.brand} {deleteTarget?.model}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ─────────────────────────────────────────────────────────── */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
