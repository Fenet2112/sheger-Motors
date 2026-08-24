import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";

import { getVehicles } from "../services/api";
import { defaultFilters, filterAndSortVehicles } from "../utils/filterVehicles";
import VehicleGrid from "../components/VehicleGrid";
import VehicleFilters from "../components/VehicleFilters";
import EmptyState from "../components/EmptyState";

const SIDEBAR_WIDTH = 280;

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchParams] = useSearchParams();

  // Pre-populate filters from URL query params
  const [filters, setFilters] = useState(() => {
    const q = searchParams.get("q") ?? defaultFilters.search;
    const condition = searchParams.get("condition") ?? defaultFilters.condition;
    const price_min = searchParams.get("price_min") ?? defaultFilters.price_min;
    const price_max = searchParams.get("price_max") ?? defaultFilters.price_max;
    return {
      ...defaultFilters,
      search: q,
      condition,
      price_min,
      price_max,
    };
  });

  const fetchVehicles = () => {
    setLoading(true);
    setError(false);
    getVehicles()
      .then((res) => {
        setVehicles(res.data ?? []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(
    () => filterAndSortVehicles(vehicles, filters),
    [vehicles, filters]
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => setFilters(defaultFilters);

  // Sidebar / filters panel (shared between desktop sidebar and mobile drawer)
  const filtersPanel = (
    <VehicleFilters
      filters={filters}
      onChange={handleFilterChange}
      onReset={handleReset}
    />
  );

  // Determine what to render in the main content area
  const renderContent = () => {
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchVehicles}>
              Try Again
            </Button>
          }
          sx={{ mb: 3 }}
        >
          Failed to load vehicles.
        </Alert>
      );
    }

    if (!loading && vehicles.length === 0) {
      return (
        <EmptyState message="No vehicles are currently listed." />
      );
    }

    if (!loading && filteredVehicles.length === 0) {
      return (
        <EmptyState
          message="No vehicles match your filters."
          actionLabel="Clear Filters"
          onAction={handleReset}
        />
      );
    }

    return <VehicleGrid vehicles={filteredVehicles} loading={loading} />;
  };

  return (
    <Box sx={{ paddingTop: "64px", minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page heading */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Available Vehicles
        </Typography>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* ── Desktop sidebar ── */}
          <Paper
            elevation={1}
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: 80,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {filtersPanel}
          </Paper>

          {/* ── Main content ── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Mobile: "Filters" toggle button + result count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              {/* Mobile filter button (hidden on md+) */}
              <Button
                startIcon={<TuneIcon />}
                variant="outlined"
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                Filters
              </Button>

              {/* Result count */}
              {!loading && !error && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: "auto" }}
                >
                  {filteredVehicles.length} vehicle
                  {filteredVehicles.length !== 1 ? "s" : ""} found
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {renderContent()}
          </Box>
        </Box>
      </Container>

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pt: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Filters
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            ✕
          </IconButton>
        </Box>
        <Divider sx={{ mt: 1 }} />
        {filtersPanel}
      </Drawer>
    </Box>
  );
}

export default Vehicles;
