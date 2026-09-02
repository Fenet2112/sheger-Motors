-- =========================================
-- SHEGER MOTORS: App Settings Table
-- Run this migration once to add settings support
-- =========================================

CREATE TABLE IF NOT EXISTS settings (
    id     SERIAL PRIMARY KEY,
    key    VARCHAR(100) UNIQUE NOT NULL,
    value  TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default values (safe to re-run — uses ON CONFLICT DO NOTHING)
INSERT INTO settings (key, value) VALUES
    ('business_name',        'Sheger Motors'),
    ('business_location',    'Addis Ababa, Ethiopia'),
    ('business_description', 'A professional vehicle dealership offering a wide variety of vehicles in Addis Ababa.'),
    ('phone',                ''),
    ('telegram',             ''),
    ('currency',             'ETB'),
    ('default_location',     'Addis Ababa')
ON CONFLICT (key) DO NOTHING;
