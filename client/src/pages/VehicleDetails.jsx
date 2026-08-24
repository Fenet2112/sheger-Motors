import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getVehicle } from "../services/api";
import { formatPrice } from "../utils/format";
import { getVehicleImages } from "../utils/vehicleImages";
import EmptyState from "../components/EmptyState";

function SpecRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ display: "flex", py: 1, borderBottom: "1px solid #f0f0f0" }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 140, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    getVehicle(id)
      .then((res) => {
        setVehicle(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setError("Failed to load vehicle details.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          paddingTop: "64px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ paddingTop: "64px" }}>
        <Container maxWidth="lg">
          <EmptyState
            message="Vehicle not found."
            actionLabel="Back to Vehicles"
            onAction={() => navigate("/vehicles")}
          />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ paddingTop: "64px" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/vehicles")}
            variant="outlined"
          >
            Back to Vehicles
          </Button>
        </Container>
      </Box>
    );
  }

  const images = getVehicleImages(vehicle);
  const currentImage = images[activeImage] || images[0];

  return (
    <Box sx={{ paddingTop: "64px", pb: 6 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back navigation */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/vehicles")}
          sx={{ mb: 3 }}
          color="inherit"
        >
          ← Back to Vehicles
        </Button>

        {/* Top section: image + title/price/CTA */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            {currentImage ? (
              <Box>
                <Box
                  component="img"
                  src={currentImage.image_url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 400 },
                    objectFit: "cover",
                    borderRadius: 2,
                    display: "block",
                    bgcolor: "grey.200",
                  }}
                />
                {images.length > 1 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: "auto" }}>
                    {images.map((image, index) => (
                      <Box
                        key={image.id || index}
                        component="img"
                        src={image.image_url}
                        alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                        onClick={() => setActiveImage(index)}
                        sx={{
                          width: 72,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: "pointer",
                          flexShrink: 0,
                          border: index === activeImage ? "2px solid" : "2px solid transparent",
                          borderColor: index === activeImage ? "primary.main" : "transparent",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  height: { xs: 250, md: 400 },
                  bgcolor: "grey.200",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DirectionsCarIcon
                  sx={{ fontSize: 80, color: "grey.500", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Photos coming soon
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Right: details */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {/* Title */}
              <Typography variant="h4" fontWeight={700}>
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </Typography>

              {/* Price */}
              <Typography variant="h5" color="secondary" fontWeight={700}>
                {formatPrice(vehicle.price)}
              </Typography>

              {/* Condition badge */}
              {vehicle.condition && (
                <Box>
                  <Chip
                    label={vehicle.condition}
                    color={
                      vehicle.condition?.toLowerCase() === "new"
                        ? "success"
                        : "default"
                    }
                    variant="outlined"
                  />
                </Box>
              )}

              <Divider />

              {/* CTA Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component="a"
                  href="tel:PHONE_NUMBER_HERE"
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneIcon />}
                  size="large"
                >
                  Call Seller
                </Button>
                <Button
                  component="a"
                  href="https://t.me/TELEGRAM_USERNAME_HERE"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="primary"
                  startIcon={<SendIcon />}
                  size="large"
                >
                  Contact on Telegram
                </Button>
              </Stack>

              {/* Location note */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Visit us in Addis Ababa to inspect the vehicle in person.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Specs section */}
        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Vehicle Specifications
          </Typography>
          <Grid container spacing={0} columns={2}>
            <Grid item xs={2} sm={1}>
              <SpecRow label="Year" value={vehicle.year} />
              <SpecRow
                label="Mileage"
                value={
                  vehicle.mileage != null
                    ? Number(vehicle.mileage).toLocaleString() + " km"
                    : null
                }
              />
              <SpecRow label="Fuel Type" value={vehicle.fuel_type} />
              <SpecRow label="Transmission" value={vehicle.transmission} />
              <SpecRow label="Engine" value={vehicle.engine} />
            </Grid>
            <Grid item xs={2} sm={1}>
              <SpecRow label="Color" value={vehicle.color} />
              <SpecRow label="Body Type" value={vehicle.body_type} />
              <SpecRow label="Condition" value={vehicle.condition} />
              <SpecRow label="Location" value={vehicle.location} />
              <SpecRow label="Status" value={vehicle.status} />
            </Grid>
          </Grid>
        </Paper>

        {/* Description section */}
        {vehicle.description && (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {vehicle.description}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default VehicleDetails;
