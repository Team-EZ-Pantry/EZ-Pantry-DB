CREATE TABLE custom_product (
    custom_product_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
    barcode TEXT UNIQUE,
    product_name TEXT NOT NULL,
    brand TEXT,
    image_url TEXT,
    categories TEXT[] DEFAULT '{}'::TEXT[],
    allergens TEXT[] DEFAULT '{}'::TEXT[],
    calories_per_100g DECIMAL(10,2),
    protein_per_100g DECIMAL(10,2),
    carbs_per_100g DECIMAL(10,2),
    fat_per_100g DECIMAL(10,2),
    nutrition JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop and recreate (loses all data)
DROP TABLE IF EXISTS pantry_product CASCADE;

CREATE TABLE pantry_product (
    pantry_id INT NOT NULL REFERENCES pantry(pantry_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE CASCADE,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    expiration_date DATE,
    added_at TIMESTAMP DEFAULT NOW()
);

-- Ensure exactly one of product_id or custom_product_id is set
ALTER TABLE pantry_product 
ADD CONSTRAINT check_product_or_custom CHECK (
    (product_id IS NOT NULL AND custom_product_id IS NULL) OR
    (product_id IS NULL AND custom_product_id IS NOT NULL)
);

-- Prevent duplicate regular products in same pantry
CREATE UNIQUE INDEX idx_pantry_regular_product 
ON pantry_product (pantry_id, product_id) 
WHERE product_id IS NOT NULL;

-- Prevent duplicate custom products in same pantry
CREATE UNIQUE INDEX idx_pantry_custom_product 
ON pantry_product (pantry_id, custom_product_id) 
WHERE custom_product_id IS NOT NULL;

-- Index for fast lookups
CREATE INDEX idx_pantry_product_pantry ON pantry_product(pantry_id);
CREATE INDEX idx_pantry_product_expiration ON pantry_product(expiration_date);

--make categories and allergens columns default to empty arrays
ALTER COLUMN categories TYPE TEXT[] USING '{}'::TEXT[];

ALTER TABLE product 
ALTER COLUMN allergens TYPE TEXT[] USING '{}'::TEXT[];