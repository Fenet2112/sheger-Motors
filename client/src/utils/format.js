/**
 * Formats a price value into a human-readable ETB string.
 * @param {string|number} value - The price to format.
 * @returns {string} Formatted price string (e.g. "1,500,000 ETB") or "Price N/A".
 */
export function formatPrice(value) {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return "Price N/A";
  }
  return num.toLocaleString() + " ETB";
}
