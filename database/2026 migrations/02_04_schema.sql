-- ================================================================================
-- Updated schema: 2026-02-05
-- Added recipe tables, pantry last visited, theme preferences, naming consistency
--      Routes use plural names. "name" -> "pantry_name" / "list_name"
-- Added updated_at to pantry table
-- ================================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================================
-- Users table
-- ================================================================
CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    theme_mode VARCHAR(10) DEFAULT 'light',
    accent_color BIGINT DEFAULT 4283215696,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_theme_mode CHECK (theme_mode IN ('light', 'dark'))
);

-- Ensure case-insensitive email uniqueness
CREATE UNIQUE INDEX unique_lower_email ON app_user (LOWER(email));

-- ================================================================
-- Products catalog (standard products from database)
-- ================================================================
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
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

-- ================================================================
-- User-defined custom products
-- ================================================================
CREATE TABLE custom_product (
    custom_product_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
    barcode TEXT,
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

-- ================================================================
-- Pantry management (users can have multiple pantries)
-- UPDATED: name → pantry_name
-- ================================================================
CREATE TABLE pantry (
    pantry_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
    pantry_name TEXT NOT NULL,
    last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- Pantry products junction table (supports both standard and custom products)
-- ================================================================
CREATE TABLE pantry_product (
    pantry_id INT NOT NULL REFERENCES pantry(pantry_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE CASCADE,
    quantity INT,
    expiration_date DATE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure exactly one of product_id or custom_product_id is set
    CONSTRAINT check_product_or_custom CHECK (
        (product_id IS NOT NULL AND custom_product_id IS NULL) OR
        (product_id IS NULL AND custom_product_id IS NOT NULL)
    )
);

-- ================================================================
-- Shopping lists
-- UPDATED: name → list_name
-- ================================================================
CREATE TABLE shopping_list (
    list_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    list_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_complete BOOLEAN DEFAULT FALSE
);

-- ================================================================
-- Shopping list items (flexible: can reference products, custom products, or free text)
-- ================================================================
CREATE TABLE shopping_list_item (
    item_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL REFERENCES shopping_list(list_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE CASCADE,
    text VARCHAR(255),
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Must have at least one identifier (product, custom_product, or text)
    -- Cannot have both product_id and custom_product_id
    CONSTRAINT shopping_list_item_check CHECK (
        (product_id IS NOT NULL OR custom_product_id IS NOT NULL OR text IS NOT NULL)
        AND
        NOT (product_id IS NOT NULL AND custom_product_id IS NOT NULL)
    )
);

-- ================================================================
-- Recipes
-- ================================================================
CREATE TABLE recipe (
    recipe_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    recipe_name TEXT NOT NULL,
    servings INT DEFAULT 1 CHECK (servings > 0),
    prep_time_minutes INT CHECK (prep_time_minutes >= 0),
    cook_time_minutes INT CHECK (cook_time_minutes >= 0),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- Recipe ingredients
-- ================================================================
CREATE TABLE recipe_ingredient (
    ingredient_id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE SET NULL,
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE SET NULL,
    free_text TEXT,
    quantity DECIMAL(10,2),
    unit TEXT, -- of measurement
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT recipe_ingredient_not_both_products CHECK (
        NOT (product_id IS NOT NULL AND custom_product_id IS NOT NULL)
    ),
    CONSTRAINT recipe_ingredient_has_identifier CHECK (
        product_id IS NOT NULL OR custom_product_id IS NOT NULL OR free_text IS NOT NULL
    )
);

-- ================================================================
-- Recipe instructions
-- ================================================================
CREATE TABLE recipe_instruction (
    instruction_id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    step_number INT NOT NULL CHECK (step_number > 0),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_recipe_step UNIQUE (recipe_id, step_number)
);

-- ================================================================
-- Indexes for performance
-- ================================================================

-- Product search index
CREATE INDEX idx_product_name_trigram ON product USING GIN (LOWER(product_name) gin_trgm_ops);

-- Prevent duplicate regular products in same pantry
CREATE UNIQUE INDEX idx_pantry_regular_product
ON pantry_product (pantry_id, product_id)
WHERE product_id IS NOT NULL;

-- Prevent duplicate custom products in same pantry
CREATE UNIQUE INDEX idx_pantry_custom_product
ON pantry_product (pantry_id, custom_product_id)
WHERE custom_product_id IS NOT NULL;

-- General performance indexes
CREATE INDEX idx_pantry_product_pantry ON pantry_product(pantry_id);
CREATE INDEX idx_pantry_product_expiration ON pantry_product(expiration_date);
CREATE INDEX idx_shopping_list_user_id ON shopping_list(user_id);

-- Recipe indexes
CREATE INDEX idx_recipe_user_id ON recipe(user_id);
CREATE INDEX idx_recipe_ingredient_recipe_id ON recipe_ingredient(recipe_id);
CREATE INDEX idx_recipe_ingredient_product_id ON recipe_ingredient(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_recipe_ingredient_custom_product_id ON recipe_ingredient(custom_product_id) WHERE custom_product_id IS NOT NULL;
CREATE INDEX idx_recipe_instruction_recipe_step ON recipe_instruction(recipe_id, step_number);
CREATE INDEX idx_recipe_name ON recipe(recipe_name);
