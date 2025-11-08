DROP TABLE IF EXISTS pantry_product CASCADE;

CREATE TABLE pantry_product (
    pantry_id INT NOT NULL REFERENCES pantry(pantry_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE CASCADE,
    quantity INT,
    expiration_date DATE,
    added_at TIMESTAMP DEFAULT NOW()
);
