import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          px: { xs: 2, sm: 4, md: 6 },
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: "white",
            mb: 2,
            fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
          }}
        >
          Find Your Next Car in Addis Ababa
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.85)",
            mb: 3,
            fontWeight: 400,
          }}
        >
          Explore quality new and used vehicles from Sheger Motors.
        </Typography>

        {/* Trust tagline */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 60,
              height: 2,
              background: "#F59E0B",
              mx: "auto",
              mb: 2,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "#F59E0B",
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Quality Vehicles • Trusted Service • Addis Ababa
          </Typography>
        </Box>

        {/* CTA Buttons */}
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
            sx={{ px: 4, py: 1.5, fontWeight: 700 }}
          >
            Browse Vehicles
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/contact")}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Contact Us
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
