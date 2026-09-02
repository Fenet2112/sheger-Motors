import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";

export const DRAWER_WIDTH = 240;
export const DRAWER_COLLAPSED_WIDTH = 64;

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { label: "Vehicles", icon: <DirectionsCarIcon />, path: "/admin/vehicles" },
  { label: "Add Vehicle", icon: <AddCircleIcon />, path: "/admin/vehicles/add" },
  { label: "Photos", icon: <PhotoLibraryIcon />, path: "/admin/photos" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
];

// ── Brand header ──────────────────────────────────────────────────────────────
function SidebarBrand({ collapsed }) {
  return (
    <Box
      sx={{
        px: collapsed ? 1 : 2.5,
        py: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minHeight: 64,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          backgroundColor: "secondary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <DirectionsCarFilledIcon sx={{ color: "#0A1929", fontSize: 20 }} />
      </Box>
      {!collapsed && (
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={800}
            sx={{ color: "white", lineHeight: 1.1, letterSpacing: 0.3 }}
          >
            SHEGER MOTORS
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>
            Admin Panel
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────────────
function NavItem({ item, collapsed, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  const button = (
    <ListItemButton
      onClick={() => onClick(item.path)}
      sx={{
        mx: 1,
        mb: 0.5,
        borderRadius: 1.5,
        minHeight: 44,
        px: collapsed ? 1 : 1.5,
        justifyContent: collapsed ? "center" : "flex-start",
        backgroundColor: isActive ? "rgba(245,158,11,0.15)" : "transparent",
        "&:hover": {
          backgroundColor: isActive
            ? "rgba(245,158,11,0.2)"
            : "rgba(255,255,255,0.07)",
        },
        transition: "background-color 0.15s",
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 36,
          color: isActive ? "secondary.main" : "rgba(255,255,255,0.6)",
          mr: collapsed ? 0 : 0,
        }}
      >
        {item.icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: "0.875rem",
            fontWeight: isActive ? 700 : 500,
            color: isActive ? "white" : "rgba(255,255,255,0.7)",
          }}
        />
      )}
      {isActive && !collapsed && (
        <Box
          sx={{
            width: 4,
            height: 20,
            borderRadius: 2,
            backgroundColor: "secondary.main",
            flexShrink: 0,
          }}
        />
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <ListItem disablePadding>
        <Tooltip title={item.label} placement="right">
          {button}
        </Tooltip>
      </ListItem>
    );
  }

  return <ListItem disablePadding>{button}</ListItem>;
}

// ── Sidebar content ───────────────────────────────────────────────────────────
function SidebarContent({ collapsed, onCollapse, onNavigate, onLogout }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0A1929",
        overflow: "hidden",
      }}
    >
      {/* Brand */}
      <SidebarBrand collapsed={collapsed} />

      {/* Collapse toggle — desktop only */}
      {onCollapse && (
        <Box sx={{ display: "flex", justifyContent: collapsed ? "center" : "flex-end", px: 1, mb: 1 }}>
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton
              size="small"
              onClick={onCollapse}
              sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "white" } }}
            >
              {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 1, mb: 1 }} />

      {/* Main nav */}
      <List sx={{ flex: 1, pt: 0.5, px: 0 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onNavigate} />
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 1, mb: 1 }} />

      {/* Bottom nav */}
      <List sx={{ pt: 0, pb: 1, px: 0 }}>
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onNavigate} />
        ))}

        {/* Logout */}
        <ListItem disablePadding>
          {collapsed ? (
            <Tooltip title="Logout" placement="right">
              <ListItemButton
                onClick={onLogout}
                sx={{
                  mx: 1,
                  borderRadius: 1.5,
                  minHeight: 44,
                  px: 1,
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "rgba(239,68,68,0.15)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: "rgba(239,68,68,0.7)" }}>
                  <LogoutIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ) : (
            <ListItemButton
              onClick={onLogout}
              sx={{
                mx: 1,
                borderRadius: 1.5,
                minHeight: 44,
                px: 1.5,
                "&:hover": { backgroundColor: "rgba(239,68,68,0.15)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "rgba(239,68,68,0.7)" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(239,68,68,0.8)",
                }}
              />
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  );
}

// ── Exported sidebar ──────────────────────────────────────────────────────────
export default function AdminSidebar({ mobileOpen, onMobileClose, collapsed, onCollapse }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onMobileClose(); // close mobile drawer on nav
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <>
      {/* Mobile: temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <SidebarContent
          collapsed={false}
          onCollapse={null}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </Drawer>

      {/* Desktop: permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            transition: "width 0.2s ease",
            overflowX: "hidden",
          },
        }}
        open
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={onCollapse}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </Drawer>
    </>
  );
}
