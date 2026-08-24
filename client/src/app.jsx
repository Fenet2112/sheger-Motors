import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Vehicles from "./pages/vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#0A1929",
      light: "#1E3A5F",
      dark: "#050E18",
    },
    secondary: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected route — redirects to /admin/login if no token in localStorage
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token || token === "") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
