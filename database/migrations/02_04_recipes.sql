CREATE TABLE recipe (
    recipe_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    recipe_name TEXT NOT NULL,
    servings INT DEFAULT 1 CHECK (servings > 0),
    prep_time_minutes INT CHECK (prep_time_minutes >= 0),
    cook_time_minutes INT CHECK (cook_time_minutes >= 0),
    image_url TEXT, -- Category image? Maybe Pro features lets user upload images
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredient (
    ingredient_id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id) ON DELETE SET NULL,
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE SET NULL,
    free_text TEXT,
    quantity DECIMAL(10,2),
    unit_of_measurement TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT recipe_ingredient_not_both_products CHECK (
        NOT (product_id IS NOT NULL AND custom_product_id IS NOT NULL)
    ),
    CONSTRAINT recipe_ingredient_has_identifier CHECK (
        product_id IS NOT NULL OR custom_product_id IS NOT NULL OR free_text IS NOT NULL
    )
);

CREATE TABLE recipe_instruction (
    instruction_id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    step_number INT NOT NULL CHECK (step_number > 0),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_recipe_step UNIQUE (recipe_id, step_number)
);

CREATE INDEX idx_recipe_user_id ON recipe(user_id);
CREATE INDEX idx_recipe_ingredient_recipe_id ON recipe_ingredient(recipe_id);
CREATE INDEX idx_recipe_ingredient_product_id ON recipe_ingredient(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_recipe_ingredient_custom_product_id ON recipe_ingredient(custom_product_id) WHERE custom_product_id IS NOT NULL;
CREATE INDEX idx_recipe_instruction_recipe_step ON recipe_instruction(recipe_id, step_number);
CREATE INDEX idx_recipe_name ON recipe(recipe_name);
