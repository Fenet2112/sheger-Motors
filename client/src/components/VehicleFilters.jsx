import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest" },
];

const CONDITION_OPTIONS = ["All", "New", "Used"];
const FUEL_OPTIONS = ["All", "Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSION_OPTIONS = ["All", "Automatic", "Manual"];
const BODY_TYPE_OPTIONS = ["All", "Sedan", "SUV", "Hatchback", "Pickup", "Minivan", "Wagon", "Coupe", "Van"];

function VehicleFilters({ filters, onChange, onReset }) {
  // Helper for select fields
  const selectField = (label, key, options) => (
    <TextField
      select
      label={label}
      value={filters[key]}
      onChange={(e) => onChange(key, e.target.value)}
      fullWidth
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Sort section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <SortIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" fontWeight={700}>Sort By</Typography>
      </Box>
      <TextField
        select
        label="Sort"
        value={filters.sort}
        onChange={(e) => onChange("sort", e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      >
        {SORT_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>

      <Divider sx={{ mb: 2 }} />

      {/* Filter section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <FilterListIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" fontWeight={700}>Filters</Typography>
      </Box>

      <Stack spacing={2}>
        <TextField
          label="Search (Brand / Model)"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          fullWidth
          size="small"
          placeholder="e.g. Toyota, Corolla"
        />
        <TextField
          label="Brand"
          value={filters.brand}
          onChange={(e) => onChange("brand", e.target.value)}
          fullWidth
          size="small"
          placeholder="e.g. Toyota"
        />
        {selectField("Condition", "condition", CONDITION_OPTIONS)}
        {selectField("Fuel Type", "fuel_type", FUEL_OPTIONS)}
        {selectField("Transmission", "transmission", TRANSMISSION_OPTIONS)}
        {selectField("Body Type", "body_type", BODY_TYPE_OPTIONS)}

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Year From"
            type="number"
            value={filters.year_min}
            onChange={(e) => onChange("year_min", e.target.value)}
            size="small"
            inputProps={{ min: 1990 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Year To"
            type="number"
            value={filters.year_max}
            onChange={(e) => onChange("year_max", e.target.value)}
            size="small"
            inputProps={{ min: 1990 }}
            sx={{ flex: 1 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Min Price (ETB)"
            type="number"
            value={filters.price_min}
            onChange={(e) => onChange("price_min", e.target.value)}
            size="small"
            inputProps={{ min: 0 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Max Price (ETB)"
            type="number"
            value={filters.price_max}
            onChange={(e) => onChange("price_max", e.target.value)}
            size="small"
            inputProps={{ min: 0 }}
            sx={{ flex: 1 }}
          />
        </Box>
      </Stack>

      <Button
        variant="outlined"
        fullWidth
        onClick={onReset}
        sx={{ mt: 3 }}
      >
        Reset Filters
      </Button>
    </Box>
  );
}

export default VehicleFilters;
