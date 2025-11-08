DROP TABLE IF EXISTS pantry CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;

-- column name change: id -> user_id
CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pantry shouldn't be one to one with app_user, add a name field and a timestamp
CREATE TABLE pantry (
    pantry_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add custom_product_id column to pantry_product table
ALTER TABLE pantry_product
ADD COLUMN custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE CASCADE;

-- Ensure that either product_id or custom_product_id is set, but not both
ALTER TABLE pantry_product
ADD CONSTRAINT check_product_or_custom CHECK (
    (product_id IS NOT NULL AND custom_product_id IS NULL) OR
    (product_id IS NULL AND custom_product_id IS NOT NULL)
);
