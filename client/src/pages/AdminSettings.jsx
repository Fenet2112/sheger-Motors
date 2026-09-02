import { useState, useEffect, useCallback } from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import TuneIcon from "@mui/icons-material/Tune";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { getSettings, updateSettings, changePassword } from "../services/api";

// ── Decode JWT payload without a library ─────────────────────────────────────
function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2.5 }} />
        {children}
      </CardContent>
    </Card>
  );
}

// ── Default settings shape ────────────────────────────────────────────────────
const defaultSettings = {
  business_name: "",
  business_location: "",
  business_description: "",
  phone: "",
  telegram: "",
  currency: "ETB",
  default_location: "Addis Ababa",
};

export default function AdminSettings() {
  const navigate = useNavigate();

  // ── Admin account from JWT ──────────────────────────────────────────────────
  const token = localStorage.getItem("token");
  const adminUser = token ? decodeToken(token) : null;

  // ── Settings state ──────────────────────────────────────────────────────────
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState(null); // { type, text }

  // ── Password state ──────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null); // { type, text }

  // ── Unsaved changes guard ───────────────────────────────────────────────────
  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // Warn on browser tab close / refresh
  useBeforeUnload(
    useCallback(
      (e) => {
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = "";
        }
      },
      [hasUnsavedChanges]
    )
  );

  // ── Fetch settings ──────────────────────────────────────────────────────────
  useEffect(() => {
    setSettingsLoading(true);
    getSettings()
      .then((res) => {
        const merged = { ...defaultSettings, ...res.data };
        setSettings(merged);
        setSavedSettings(merged);
        setSettingsError(null);
      })
      .catch(() => setSettingsError("Unable to load settings."))
      .finally(() => setSettingsLoading(false));
  }, []);

  // ── Handle settings field change ────────────────────────────────────────────
  const handleSettingChange = (key) => (e) => {
    setSettings((prev) => ({ ...prev, [key]: e.target.value }));
    setSettingsSaveMsg(null);
  };

  // ── Save settings ───────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsSaveMsg(null);
    try {
      await updateSettings(settings);
      setSavedSettings({ ...settings });
      setSettingsSaveMsg({ type: "success", text: "Settings updated successfully." });
    } catch {
      setSettingsSaveMsg({ type: "error", text: "Unable to update settings. Please try again." });
    } finally {
      setSavingSettings(false);
    }
  };

  // ── Handle password field change ────────────────────────────────────────────
  const handlePasswordChange = (field) => (e) => {
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));
    setPasswordMsg(null);
  };

  // ── Submit password change ──────────────────────────────────────────────────
  const handleChangePassword = async () => {
    const { current, newPass, confirm } = passwords;

    if (!current || !newPass || !confirm) {
      setPasswordMsg({ type: "error", text: "All password fields are required." });
      return;
    }
    if (newPass !== confirm) {
      setPasswordMsg({ type: "error", text: "New password and confirmation do not match." });
      return;
    }
    if (newPass.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }

    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      await changePassword({ currentPassword: current, newPassword: newPass });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setPasswordMsg({ type: "success", text: "Password changed successfully." });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password.";
      setPasswordMsg({ type: "error", text: msg });
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  // ── Toggle password visibility ──────────────────────────────────────────────
  const toggleShow = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 4 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your Sheger Motors administration settings.
      </Typography>

      {/* ── 1. Admin Account ──────────────────────────────────────────────────── */}
      <SectionCard icon={<PersonOutlineIcon />} title="Admin Account">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              NAME
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.25 }}>
              {adminUser?.name || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              EMAIL
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.25 }}>
              {adminUser?.email || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              ROLE
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={adminUser?.role ? adminUser.role.charAt(0).toUpperCase() + adminUser.role.slice(1) : "—"}
                size="small"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          To update your name or email, contact your system administrator.
        </Typography>
      </SectionCard>

      {/* ── 2. Security ───────────────────────────────────────────────────────── */}
      <SectionCard icon={<LockOutlinedIcon />} title="Security">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={passwords.current}
              onChange={handlePasswordChange("current")}
              fullWidth
              size="small"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => toggleShow("current")}>
                      {showPasswords.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="New Password"
              type={showPasswords.newPass ? "text" : "password"}
              value={passwords.newPass}
              onChange={handlePasswordChange("newPass")}
              fullWidth
              size="small"
              autoComplete="new-password"
              helperText="Minimum 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => toggleShow("newPass")}>
                      {showPasswords.newPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={handlePasswordChange("confirm")}
              fullWidth
              size="small"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => toggleShow("confirm")}>
                      {showPasswords.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {passwordMsg && (
          <Alert severity={passwordMsg.type} sx={{ mt: 2 }}>
            {passwordMsg.text}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={passwordSaving}
            startIcon={passwordSaving ? <CircularProgress size={16} color="inherit" /> : <LockOutlinedIcon />}
          >
            {passwordSaving ? "Changing..." : "Change Password"}
          </Button>
        </Box>
      </SectionCard>

      {/* ── 3. Business Information ───────────────────────────────────────────── */}
      <SectionCard icon={<BusinessIcon />} title="Business Information">
        {settingsLoading ? (
          <Grid container spacing={2}>
            {[...Array(3)].map((_, i) => (
              <Grid item xs={12} key={i}>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : settingsError ? (
          <Alert severity="error">{settingsError}</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Business Name"
                value={settings.business_name}
                onChange={handleSettingChange("business_name")}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Business Location"
                value={settings.business_location}
                onChange={handleSettingChange("business_location")}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Business Description"
                value={settings.business_description}
                onChange={handleSettingChange("business_description")}
                fullWidth
                size="small"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        )}
      </SectionCard>

      {/* ── 4. Contact Information ────────────────────────────────────────────── */}
      <SectionCard icon={<ContactPhoneIcon />} title="Website Contact Information">
        {settingsLoading ? (
          <Grid container spacing={2}>
            {[...Array(2)].map((_, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : settingsError ? null : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                value={settings.phone}
                onChange={handleSettingChange("phone")}
                fullWidth
                size="small"
                placeholder="+251 9XX XXX XXXX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telegram Username / Link"
                value={settings.telegram}
                onChange={handleSettingChange("telegram")}
                fullWidth
                size="small"
                placeholder="@shegermotors"
              />
            </Grid>
          </Grid>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
          These contact details are displayed to customers on the public website.
        </Typography>
      </SectionCard>

      {/* ── 5. Preferences ───────────────────────────────────────────────────── */}
      <SectionCard icon={<TuneIcon />} title="Preferences">
        {settingsLoading ? (
          <Grid container spacing={2}>
            {[...Array(2)].map((_, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : settingsError ? null : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Currency"
                value={settings.currency}
                onChange={handleSettingChange("currency")}
                fullWidth
                size="small"
                placeholder="ETB"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Default Location"
                value={settings.default_location}
                onChange={handleSettingChange("default_location")}
                fullWidth
                size="small"
                placeholder="Addis Ababa"
              />
            </Grid>
          </Grid>
        )}
      </SectionCard>

      {/* ── Save Settings ─────────────────────────────────────────────────────── */}
      {!settingsError && (
        <Box sx={{ mb: 3 }}>
          {settingsSaveMsg && (
            <Alert severity={settingsSaveMsg.type} sx={{ mb: 2 }}>
              {settingsSaveMsg.text}
            </Alert>
          )}
          {hasUnsavedChanges && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You have unsaved changes.
            </Alert>
          )}
          <Button
            variant="contained"
            size="large"
            onClick={handleSaveSettings}
            disabled={savingSettings || settingsLoading}
            startIcon={savingSettings ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          >
            {savingSettings ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      )}

      {/* ── Danger Zone ───────────────────────────────────────────────────────── */}
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "error.light",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <Box sx={{ color: "error.main", display: "flex" }}>
              <WarningAmberIcon />
            </Box>
            <Typography variant="h6" fontWeight={700} color="error.main">
              Danger Zone
            </Typography>
          </Box>
          <Divider sx={{ mb: 2.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Logging out will end your current admin session.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
