import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SettingsIcon from "@mui/icons-material/Settings";
import { formatPrice } from "../utils/format";

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
          transition: "all 0.2s ease",
        },
      }}
    >
      {/* Image placeholder */}
      <Box
        sx={{
          height: 200,
          backgroundColor: "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DirectionsCarIcon sx={{ fontSize: 64, color: "#9ca3af" }} />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>
            {vehicle.brand} {vehicle.model}
          </Typography>
          <Chip
            label={vehicle.condition}
            size="small"
            sx={{
              backgroundColor:
                vehicle.condition === "New" ? "#d1fae5" : "#f3f4f6",
              color: vehicle.condition === "New" ? "#065f46" : "#374151",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
        </Box>

        {/* Price */}
        <Typography
          variant="h6"
          color="secondary"
          fontWeight={700}
          sx={{ mb: 1.5 }}
        >
          {formatPrice(vehicle.price)}
        </Typography>

        {/* Specs chips */}
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          useFlexGap
          sx={{ gap: 0.5 }}
        >
          <Chip
            icon={<SpeedIcon />}
            label={`${Number(vehicle.mileage).toLocaleString()} km`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<LocalGasStationIcon />}
            label={vehicle.fuel_type}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<SettingsIcon />}
            label={vehicle.transmission}
            size="small"
            variant="outlined"
          />
          <Chip label={vehicle.year} size="small" variant="outlined" />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default VehicleCard;
