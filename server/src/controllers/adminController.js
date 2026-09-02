const pool = require("../config/db");

/**
 * GET /api/admin/stats
 * Returns real-time inventory statistics from PostgreSQL.
 */
const getStats = async (req, res) => {
  try {
    // Run all stat queries in parallel for performance
    const [statusCounts, brandCounts, recentVehicles, valueSummary] =
      await Promise.all([
        // Count by status
        pool.query(`
          SELECT status, COUNT(*) AS count
          FROM vehicles
          GROUP BY status
          ORDER BY status
        `),

        // Count by brand (top 8)
        pool.query(`
          SELECT brand, COUNT(*) AS count
          FROM vehicles
          GROUP BY brand
          ORDER BY count DESC
          LIMIT 8
        `),

        // 5 most recently added vehicles
        pool.query(`
          SELECT id, brand, model, year, price, status, condition, created_at
          FROM vehicles
          ORDER BY created_at DESC
          LIMIT 5
        `),

        // Total inventory value + average price
        pool.query(`
          SELECT
            COUNT(*)                          AS total_vehicles,
            COALESCE(SUM(price), 0)           AS total_value,
            COALESCE(AVG(price), 0)           AS average_price
          FROM vehicles
        `),
      ]);

    // Build a status map { AVAILABLE: N, SOLD: N, RESERVED: N }
    const statusMap = {};
    for (const row of statusCounts.rows) {
      statusMap[row.status] = parseInt(row.count, 10);
    }

    const summary = valueSummary.rows[0];

    res.status(200).json({
      totals: {
        vehicles: parseInt(summary.total_vehicles, 10),
        available: statusMap["AVAILABLE"] || 0,
        sold: statusMap["SOLD"] || 0,
        reserved: statusMap["RESERVED"] || 0,
        totalValue: parseFloat(summary.total_value),
        averagePrice: parseFloat(summary.average_price),
      },
      byBrand: brandCounts.rows.map((r) => ({
        brand: r.brand,
        count: parseInt(r.count, 10),
      })),
      recentVehicles: recentVehicles.rows,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to load dashboard statistics." });
  }
};

module.exports = { getStats };

// ── Allowed setting keys (whitelist) ─────────────────────────────────────────
const ALLOWED_KEYS = [
  "business_name",
  "business_location",
  "business_description",
  "phone",
  "telegram",
  "currency",
  "default_location",
];

/**
 * GET /api/admin/settings
 * Returns all application settings as a flat key→value object.
 */
const getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT key, value FROM settings ORDER BY key"
    );

    // Convert rows to a plain object
    const settings = {};
    for (const row of result.rows) {
      settings[row.key] = row.value ?? "";
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Failed to load settings" });
  }
};

/**
 * PUT /api/admin/settings
 * Upserts one or more settings.
 * Body: { key: value, ... }
 */
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ message: "Invalid settings payload" });
    }

    const entries = Object.entries(updates).filter(([key]) =>
      ALLOWED_KEYS.includes(key)
    );

    if (entries.length === 0) {
      return res.status(400).json({ message: "No valid settings provided" });
    }

    // Upsert each key
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO settings (key, value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key)
         DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    }

    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
};

module.exports = { getStats, getSettings, updateSettings };
