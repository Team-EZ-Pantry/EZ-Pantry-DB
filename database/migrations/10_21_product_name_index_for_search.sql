CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_product_name_trigram
ON product
USING GIN (LOWER(product_name) gin_trgm_ops);