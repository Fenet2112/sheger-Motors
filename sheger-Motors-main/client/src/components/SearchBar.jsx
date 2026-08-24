import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

const CONDITIONS = ["All", "New", "Used"];

function SearchBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (condition !== "All") params.set("condition", condition);
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Brand or Model"
              placeholder="e.g. Toyota, Corolla"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              fullWidth
              size="small"
            >
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Min Price (ETB)"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Max Price (ETB)"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="medium"
              startIcon={<SearchIcon />}
              sx={{ py: 1 }}
            >
              Search Cars
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default SearchBar;
