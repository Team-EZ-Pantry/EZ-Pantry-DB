ALTER TABLE app_user
ADD COLUMN theme_mode VARCHAR(10) DEFAULT 'light',
ADD COLUMN accent_color BIGINT DEFAULT 4283215696;

-- Add check constraint for valid theme modes
ALTER TABLE app_user
ADD CONSTRAINT check_theme_mode CHECK (theme_mode IN ('light', 'dark'));
