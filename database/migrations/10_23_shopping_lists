-- sql script to create shopping list tables

-- shopping_list
-- (auto incrementing) listId, userId, name, createdAt, updatedAt, isComplete

-- shopping_list_item
-- (auto incrementing) itemId, listId, productId, quantity, checked, createdAt, updatedAt

CREATE TABLE shopping_list (
    list_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id)
);

CREATE TABLE shopping_list_item (
    item_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES shopping_list(list_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);