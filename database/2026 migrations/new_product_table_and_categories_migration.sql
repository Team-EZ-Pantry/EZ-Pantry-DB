-- new product table and categories migrations --
-------------------------------------------------

-- old product table will need to be deleted (or you can rename the table)
DROP TABLE product CASCADE;

-- create new standard product food table
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    barcode TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    brand TEXT,
    image_url TEXT,
    calories_per_serving DECIMAL(10,2),
    protein_per_serving DECIMAL(10,2),
    carbs_per_serving DECIMAL(10,2),
    fat_per_serving DECIMAL(10,2),
    nutrition JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Your category table 
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    name TEXT NOT NULL,
    tier INT NOT NULL CHECK (tier IN (1, 2, 3)),
    parent_id INT NULL,
    usda_category_id INT NULL,
    image_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_tier ON categories(tier);

-- categories linking table
CREATE TABLE product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

--------------------------------------------------------------------------------------

-- export data
-- docker exec ez-pantry-jl psql -U devuser -d ez_pantry -c "\COPY categories_a TO '/tmp/categories.csv' CSV HEADER"
-- docker cp ez-pantry-jl:/tmp/categories.csv ./categories.csv

-- docker exec ez-pantry-jl psql -U devuser -d ez_pantry -c "\COPY product_c TO '/tmp/product.csv' CSV HEADER"
-- docker cp ez-pantry-jl:/tmp/product.csv ./product.csv

-- docker exec ez-pantry-jl psql -U devuser -d ez_pantry -c "\COPY product_categories TO '/tmp/product_categories.csv' CSV HEADER"
-- docker cp ez-pantry-jl:/tmp/product_categories.csv ./product_categories.csv

-- import data
docker cp categories.csv your_container_name:/tmp/
docker exec your_container_name psql -U your_username -d your_database -c "\COPY categories FROM '/tmp/categories.csv' CSV HEADER"

docker cp product.csv your_container_name:/tmp/
docker exec your_container_name psql -U your_username -d your_database -c "\COPY product FROM '/tmp/product.csv' CSV HEADER"

docker cp product_categories.csv your_container_name:/tmp/
docker exec your_container_name psql -U your_username -d your_database -c "\COPY product_categories FROM '/tmp/product_categories.csv' CSV HEADER"





