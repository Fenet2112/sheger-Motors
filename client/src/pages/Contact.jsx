import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const contactInfo = [
  {
    icon: <PhoneIcon fontSize="large" color="primary" />,
    label: "Phone",
    value: "PHONE_NUMBER_HERE",
    href: "0930900008",
  },
  {
    icon: <SendIcon fontSize="large" color="primary" />,
    label: "Telegram",
    value: "TELEGRAM_USERNAME_HERE",
    href: "https://t.me/TELEGRAM_USERNAME_HERE",
  },
  {
    icon: <LocationOnIcon fontSize="large" color="primary" />,
    label: "Location",
    value: "Addis Ababa, Ethiopia",
    href: null,
  },
];

const steps = [
  "Browse our available vehicles online",
  "Contact us by phone or Telegram",
  "Visit us in Addis Ababa to inspect the vehicle in person",
  "Complete the purchase in person if you're satisfied",
];

function Contact() {
  const navigate = useNavigate();

  return (
    <Box sx={{ paddingTop: "64px", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Contact Sheger Motors
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            We'd love to help you find your perfect vehicle
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3} justifyContent="center">
          {contactInfo.map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <CardContent sx={{ py: 4 }}>
                  <Stack alignItems="center" spacing={1.5}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      {item.label}
                    </Typography>
                    {item.href ? (
                      <Typography
                        component="a"
                        href={item.href}
                        variant="body1"
                        fontWeight="medium"
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {item.value}
                      </Typography>
                    ) : (
                      <Typography variant="body1" fontWeight="medium">
                        {item.value}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* How to Buy Section */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "grey.50" }}>
        <Container maxWidth="sm">
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            How to buy a car from us
          </Typography>
          <Stack spacing={2}>
            {steps.map((step, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ borderRadius: 2, px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body1">{step}</Typography>
              </Paper>
            ))}
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            All purchases are completed in person at our Addis Ababa location. No online payments required.
          </Typography>
        </Container>
      </Box>

      <Divider />

      {/* CTA Section */}
      <Box sx={{ py: { xs: 5, md: 7 }, textAlign: "center" }}>
        <Container maxWidth="sm">
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            Ready to browse?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Explore our current inventory and find the vehicle that suits you.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/vehicles")}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Browse Available Cars
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Contact;
