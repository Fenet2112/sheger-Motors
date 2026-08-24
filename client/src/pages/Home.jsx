import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import VerifiedIcon from "@mui/icons-material/Verified";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";

import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import VehicleGrid from "../components/VehicleGrid";
import { getVehicles } from "../services/api";

// ── Section 4 data ──────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Quality Vehicles",
    description: "Carefully selected vehicles for our customers.",
  },
  {
    icon: <DirectionsCarIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "New & Used Cars",
    description: "Find vehicles that match your needs and budget.",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Addis Ababa",
    description: "Serving customers in Addis Ababa.",
  },
  {
    icon: <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Personal Service",
    description: "Inspect the vehicle in person before making your decision.",
  },
];

// ── Section 5 data ──────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    title: "Browse Vehicles",
    description: "Explore our catalogue of new and used cars.",
  },
  {
    number: "02",
    title: "Contact Us",
    description: "Call or message us on Telegram.",
  },
  {
    number: "03",
    title: "Visit & Inspect",
    description: "Come see the vehicle in person in Addis Ababa.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVehicles()
      .then((res) => {
        const vehicles = res.data?.data ?? res.data ?? [];
        setFeatured(vehicles.slice(0, 8));
      })
      .catch((err) => {
        setError(err.message || "Failed to load vehicles.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ paddingTop: "64px" }}>
      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── Section 2: Quick Search ──────────────────────────────────────── */}
      <Box sx={{ bgcolor: "white", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={4}
            color="text.primary"
          >
            Search Our Inventory
          </Typography>
          <SearchBar />
        </Container>
      </Box>

      {/* ── Section 3: Featured Vehicles ─────────────────────────────────── */}
      <Box sx={{ bgcolor: "#F8F9FA", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={1}
            color="text.primary"
          >
            Featured Vehicles
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            mb={5}
          >
            Browse our latest available cars
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <VehicleGrid vehicles={featured} loading={loading} />
          )}

          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/vehicles")}
              sx={{ px: 5, py: 1.5, fontWeight: 700 }}
            >
              View All Vehicles
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Section 4: Why Choose Sheger Motors ──────────────────────────── */}
      <Box sx={{ bgcolor: "white", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={1}
            color="text.primary"
          >
            Why Choose Sheger Motors
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            mb={6}
          >
            We make finding your next car simple and trustworthy.
          </Typography>

          <Grid container spacing={3}>
            {BENEFITS.map((benefit) => (
              <Grid item xs={12} sm={6} md={3} key={benefit.title}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box mb={2}>{benefit.icon}</Box>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Section 5: How It Works ───────────────────────────────────────── */}
      <Box sx={{ bgcolor: "#F8F9FA", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={1}
            color="text.primary"
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            mb={6}
          >
            Three simple steps to your next vehicle.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {STEPS.map((step) => (
              <Grid item xs={12} sm={4} key={step.number}>
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{ color: "primary.main", opacity: 0.15, lineHeight: 1, mb: 1 }}
                  >
                    {step.number}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Section 6: CTA Banner ─────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: "#0A1929",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            color="white"
            mb={2}
          >
            Ready to Find Your Next Car?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.75)", mb: 5 }}
          >
            Browse our collection or get in touch with us directly.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/vehicles")}
              sx={{ px: 5, py: 1.5, fontWeight: 700 }}
            >
              Browse Vehicles
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/contact")}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 700,
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Contact Sheger Motors
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
