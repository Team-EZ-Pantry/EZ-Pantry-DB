CREATE TABLE shopping_list (
    list_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_complete BOOLEAN DEFAULT FALSE
);

-- Index for faster user queries
CREATE INDEX idx_shopping_list_user_id ON shopping_list(user_id);

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
    -- Constraint: Must have at least one identifier
    -- Can be: product, custom_product, text, or product/custom_product + text (note)
    -- Cannot have both product_id and custom_product_id
    CONSTRAINT shopping_list_item_check CHECK (
        (product_id IS NOT NULL OR custom_product_id IS NOT NULL OR text IS NOT NULL)
        AND
        NOT (product_id IS NOT NULL AND custom_product_id IS NOT NULL)
    )
);