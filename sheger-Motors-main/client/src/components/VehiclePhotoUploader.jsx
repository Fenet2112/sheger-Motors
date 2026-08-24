import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

/**
 * VehiclePhotoUploader
 * 
 * Component for selecting and previewing multiple vehicle photos before upload.
 * 
 * @param {File[]} selectedFiles - Array of selected file objects
 * @param {Function} onFilesChange - Callback when files are selected/changed
 * @param {Function} onRemove - Callback to remove a specific file by index
 * @param {number} maxFiles - Maximum number of files allowed (default: 10)
 * @param {number} maxSize - Maximum file size in MB (default: 5)
 */
export default function VehiclePhotoUploader({
  selectedFiles = [],
  onFilesChange,
  onRemove,
  maxFiles = 10,
  maxSize = 5,
}) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);

  // Generate preview URLs when selectedFiles changes
  useEffect(() => {
    // Clean up old object URLs
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    // Create new preview URLs
    const newPreviews = selectedFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      index,
    }));

    setPreviews(newPreviews);

    // Cleanup on unmount
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  // Validate and handle file selection
  const handleFileSelect = (event) => {
    setError(null);
    const files = Array.from(event.target.files);

    // Check if adding these files would exceed the max
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} photos.`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const maxSizeBytes = maxSize * 1024 * 1024;

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not a valid image file.`);
        return;
      }

      // Check specific image types
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError(
          `"${file.name}" is not a supported format. Use JPG, PNG, or WEBP.`
        );
        return;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        setError(
          `"${file.name}" is too large. Maximum size is ${maxSize} MB.`
        );
        return;
      }

      validFiles.push(file);
    }

    // All files are valid, add them
    onFilesChange([...selectedFiles, ...validFiles]);
  };

  const handleRemove = (index) => {
    onRemove(index);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Vehicle Photos
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload photos of the vehicle (optional)
      </Typography>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* File input button */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<AddPhotoAlternateIcon />}
        disabled={selectedFiles.length >= maxFiles}
        sx={{ mb: 2 }}
      >
        Add Photos
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </Button>

      {/* File count and limit info */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {selectedFiles.length} of {maxFiles} photos selected • Max {maxSize} MB
        per photo
      </Typography>

      {/* Preview grid */}
      {previews.length > 0 && (
        <Grid container spacing={2}>
          {previews.map((preview) => (
            <Grid item xs={6} sm={4} md={3} key={preview.index}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "75%", // 4:3 aspect ratio
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "grey.100",
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src={preview.url}
                  alt={preview.name}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Remove button */}
                <IconButton
                  size="small"
                  onClick={() => handleRemove(preview.index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  }}
                  aria-label={`Remove ${preview.name}`}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                {/* File name tooltip */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ fontSize: "0.65rem" }}
                  >
                    {preview.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
