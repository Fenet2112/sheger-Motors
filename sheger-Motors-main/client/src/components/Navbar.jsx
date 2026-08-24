import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(10,25,41,0.95)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Brand */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ cursor: "pointer", color: "#fff", letterSpacing: 0.5 }}
            onClick={() => handleNavigate("/")}
          >
            Sheger Motors
          </Typography>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navLinks.map(({ label, path }) => (
              <Button
                key={path}
                onClick={() => handleNavigate(path)}
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  borderRadius: 1,
                  px: 1.5,
                  borderBottom: isActive(path)
                    ? "2px solid #F59E0B"
                    : "2px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Right side: CTA + hamburger */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleNavigate("/vehicles")}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Browse Cars
            </Button>

            {/* Hamburger — visible only on mobile */}
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            backgroundColor: "#0A1929",
            color: "#fff",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Sheger Motors
          </Typography>
          <IconButton
            color="inherit"
            aria-label="close navigation menu"
            onClick={() => setDrawerOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer nav links */}
        <List>
          {navLinks.map(({ label, path }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(path)}
                sx={{
                  borderLeft: isActive(path)
                    ? "3px solid #F59E0B"
                    : "3px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: isActive(path) ? 700 : 400,
                    color: isActive(path) ? "#F59E0B" : "#fff",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Browse Cars CTA in drawer */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => handleNavigate("/vehicles")}
          >
            Browse Cars
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
