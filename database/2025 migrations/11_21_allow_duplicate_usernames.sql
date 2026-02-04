-- For some reason I had a constraint preventing duplicate usernames on my backend.
-- This migration removes that constraint
ALTER TABLE app_user DROP CONSTRAINT app_user_username_key;