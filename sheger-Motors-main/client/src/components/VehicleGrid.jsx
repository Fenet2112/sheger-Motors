import Grid from "@mui/material/Grid";
import VehicleCard from "./VehicleCard";
import Loading from "./Loading";
import EmptyState from "./EmptyState";

function VehicleGrid({ vehicles = [], loading = false, onClearFilters }) {
  if (loading) {
    return <Loading count={6} />;
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        message="No vehicles are currently listed."
        actionLabel={onClearFilters ? "Clear Filters" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {vehicles.map((vehicle) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
          <VehicleCard vehicle={vehicle} />
        </Grid>
      ))}
    </Grid>
  );
}

export default VehicleGrid;
