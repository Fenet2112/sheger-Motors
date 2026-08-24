-- =========================================
-- SHEGER MOTORS DATABASE SCHEMA
-- =========================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,

    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,

    year INTEGER NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    mileage INTEGER,

    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    engine VARCHAR(100),
    color VARCHAR(50),
    body_type VARCHAR(50),
    condition VARCHAR(50),

    description TEXT,

    location VARCHAR(150) DEFAULT 'Addis Ababa',

    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- VEHICLE IMAGES
CREATE TABLE IF NOT EXISTS vehicle_images (
    id SERIAL PRIMARY KEY,

    vehicle_id INTEGER NOT NULL,

    image_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE
);


-- CUSTOMER INQUIRIES
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,

    vehicle_id INTEGER,

    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),

    message TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'NEW',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inquiry_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE SET NULL
);