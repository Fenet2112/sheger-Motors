import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

import AdminSidebar, { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "./AdminSidebar";

// Map routes → readable page titles
const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/vehicles": "Vehicles",
  "/admin/vehicles/add": "Add Vehicle",
  "/admin/photos": "Photos",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;
  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((c) => !c)}
      />

      {/* ── Main content area ────────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: 0 },
          transition: "width 0.2s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* ── Top App Bar ──────────────────────────────────────────────────── */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          <Toolbar sx={{ minHeight: "56px !important", px: { xs: 2, md: 3 } }}>
            {/* Hamburger — mobile only */}
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: "none" } }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>

            {/* Page title */}
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              {pageTitle}
            </Typography>

            {/* Admin avatar / menu */}
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              aria-label="Admin menu"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "primary.main",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                A
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{ elevation: 3, sx: { minWidth: 160, mt: 0.5 } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" fontWeight={600}>Admin</Typography>
                <Typography variant="caption" color="text.secondary">Administrator</Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => { setAnchorEl(null); navigate("/admin/settings"); }}
                sx={{ gap: 1.5, fontSize: "0.875rem" }}
              >
                <SettingsIcon fontSize="small" sx={{ color: "text.secondary" }} />
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => { setAnchorEl(null); handleLogout(); }}
                sx={{ gap: 1.5, fontSize: "0.875rem", color: "error.main" }}
              >
                <LogoutIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* ── Page content ─────────────────────────────────────────────────── */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
