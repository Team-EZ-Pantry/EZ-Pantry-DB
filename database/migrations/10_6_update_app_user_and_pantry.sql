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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);