import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link as RouterLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Vehicles", to: "/vehicles" },
  { label: "Contact", to: "/contact" },
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0A1929",
        color: "#fff",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1 — Brand */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Sheger Motors
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Quality cars. Trusted service.
            </Typography>
          </Grid>

          {/* Column 2 — Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  component={RouterLink}
                  to={to}
                  underline="hover"
                  sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
                >
                  {label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Column 3 — Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  +251 930900008 +251 929043499
                 
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SendIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  TELEGRAM_USERNAME_HERE
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Addis Ababa, Ethiopia
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mt: 5, mb: 3 }} />
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "rgba(255,255,255,0.5)" }}
        >
          © 2026 Sheger Motors. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
