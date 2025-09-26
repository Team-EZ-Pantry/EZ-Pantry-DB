CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pantry (
    pantry_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    barcode TEXT UNIQUE,
    product_name TEXT NOT NULL,
    brand TEXT,
	  image_url TEXT,
	  categories TEXT[],
	  allergens TEXT[],
	  calories_per_100g DECIMAL(10,2),
	  protein_per_100g DECIMAL(10,2),
	  carbs_per_100g DECIMAL(10,2),
	  fat_per_100g DECIMAL(10,2),
	  nutrition JSONB,
	  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pantry_product (
    pantry_id INT REFERENCES pantry(pantry_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    quantity INT DEFAULT 0,
    expiration_date DATE,
    PRIMARY KEY (pantry_id, product_id)
);
