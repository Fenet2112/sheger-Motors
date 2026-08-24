/**
 * Default filter state for the vehicle listing page.
 */
export const defaultFilters = {
  search: "",
  brand: "",
  condition: "All",
  fuel_type: "All",
  transmission: "All",
  body_type: "All",
  year_min: "",
  year_max: "",
  price_min: "",
  price_max: "",
  sort: "newest",
};

/**
 * Filters and sorts a list of vehicles based on the provided filters.
 * Does NOT mutate the input array.
 *
 * @param {Array} vehicles - The full list of vehicle objects.
 * @param {Object} filters - The filter/sort criteria.
 * @returns {Array} A new filtered and sorted array of vehicles.
 */
export function filterAndSortVehicles(vehicles, filters) {
  let result = [...vehicles];

  // Filter by search (case-insensitive match against brand + model)
  if (filters.search && filters.search.trim() !== "") {
    const query = filters.search.trim().toLowerCase();
    result = result.filter((v) => {
      const combined = `${v.brand ?? ""} ${v.model ?? ""}`.toLowerCase();
      return combined.includes(query);
    });
  }

  // Filter by brand (case-insensitive exact match)
  if (filters.brand && filters.brand.trim() !== "") {
    const brand = filters.brand.trim().toLowerCase();
    result = result.filter(
      (v) => (v.brand ?? "").toLowerCase() === brand
    );
  }

  // Filter by condition (skip if "All")
  if (filters.condition && filters.condition !== "All") {
    result = result.filter((v) => v.condition === filters.condition);
  }

  // Filter by fuel_type (skip if "All")
  if (filters.fuel_type && filters.fuel_type !== "All") {
    result = result.filter((v) => v.fuel_type === filters.fuel_type);
  }

  // Filter by transmission (skip if "All")
  if (filters.transmission && filters.transmission !== "All") {
    result = result.filter((v) => v.transmission === filters.transmission);
  }

  // Filter by body_type (skip if "All")
  if (filters.body_type && filters.body_type !== "All") {
    result = result.filter((v) => v.body_type === filters.body_type);
  }

  // Filter by year_min
  if (filters.year_min !== "" && filters.year_min !== undefined) {
    const yearMin = Number(filters.year_min);
    if (!isNaN(yearMin)) {
      result = result.filter((v) => Number(v.year) >= yearMin);
    }
  }

  // Filter by year_max
  if (filters.year_max !== "" && filters.year_max !== undefined) {
    const yearMax = Number(filters.year_max);
    if (!isNaN(yearMax)) {
      result = result.filter((v) => Number(v.year) <= yearMax);
    }
  }

  // Filter by price_min
  if (filters.price_min !== "" && filters.price_min !== undefined) {
    const priceMin = parseFloat(filters.price_min);
    if (!isNaN(priceMin)) {
      result = result.filter((v) => parseFloat(v.price) >= priceMin);
    }
  }

  // Filter by price_max
  if (filters.price_max !== "" && filters.price_max !== undefined) {
    const priceMax = parseFloat(filters.price_max);
    if (!isNaN(priceMax)) {
      result = result.filter((v) => parseFloat(v.price) <= priceMax);
    }
  }

  // Sort
  switch (filters.sort) {
    case "price_asc":
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price_desc":
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "year_desc":
      result.sort((a, b) => Number(b.year) - Number(a.year));
      break;
    case "newest":
    default:
      result.sort((a, b) => Number(b.id) - Number(a.id));
      break;
  }

  return result;
}
