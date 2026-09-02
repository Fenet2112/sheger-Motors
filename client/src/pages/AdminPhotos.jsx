import { Box, Typography, Card, CardContent } from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

export default function AdminPhotos() {
  return (
    <Box>
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ py: 6, textAlign: "center" }}>
          <PhotoLibraryIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Vehicle Photos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Photo management for all vehicles. Upload photos when adding or editing a vehicle
            from the Vehicles section.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
