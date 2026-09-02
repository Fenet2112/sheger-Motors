import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  Alert,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

/**
 * CurrentPhotos
 *
 * Displays existing vehicle photos with individual delete (with confirmation).
 *
 * Props:
 *   images        – array of { id, image_url } from the DB
 *   loading       – boolean, show skeletons while fetching
 *   onDelete      – async (imageId) => void — called after user confirms
 *   deletingId    – imageId currently being deleted (shows loading state)
 */
export default function CurrentPhotos({ images = [], loading, onDelete, deletingId }) {
  const [confirmTarget, setConfirmTarget] = useState(null); // { id, image_url }

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    await onDelete(confirmTarget.id);
    setConfirmTarget(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Current Photos
        </Typography>
        {!loading && (
          <Chip
            label={`${images.length} photo${images.length !== 1 ? "s" : ""}`}
            size="small"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}
      </Box>

      {loading ? (
        <Grid container spacing={1.5}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Skeleton variant="rectangular" sx={{ borderRadius: 1, paddingTop: "75%" }} />
            </Grid>
          ))}
        </Grid>
      ) : images.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            color: "text.secondary",
          }}
        >
          <PhotoLibraryIcon sx={{ fontSize: 32, mb: 0.5, opacity: 0.4 }} />
          <Typography variant="body2">No photos yet</Typography>
        </Box>
      ) : (
        <Grid container spacing={1.5}>
          {images.map((img) => (
            <Grid item xs={6} sm={4} md={3} key={img.id}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "75%",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "grey.100",
                  opacity: deletingId === img.id ? 0.4 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <Box
                  component="img"
                  src={img.image_url}
                  alt="Vehicle photo"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  disabled={deletingId === img.id}
                  onClick={() => setConfirmTarget(img)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.55)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(239,68,68,0.85)" },
                  }}
                  aria-label="Remove photo"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirm delete dialog */}
      <Dialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Photo?</DialogTitle>
        <DialogContent>
          {confirmTarget && (
            <Box>
              <Box
                component="img"
                src={confirmTarget.image_url}
                alt="Photo to remove"
                sx={{
                  width: "100%",
                  maxHeight: 180,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Are you sure you want to remove this photo? This cannot be undone.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
