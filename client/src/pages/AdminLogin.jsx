import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginAdmin({ email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 2,
        }}
      >
        {/* Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Box>
        </Box>

        {/* Heading */}
        <Typography
          variant="h5"
          fontWeight={700}
          align="center"
          gutterBottom
        >
          Sheger Motors Admin
        </Typography>

        {/* Sub-heading */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Sign in to manage vehicles
        </Typography>

        {/* Error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, mb: 1, py: 1.25 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        {/* Back link */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            ← Back to site
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
