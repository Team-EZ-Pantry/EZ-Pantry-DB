-- ================================================================================
-- Migration: 2026-02-05
-- Add updated_at column to pantry table
-- ================================================================================

ALTER TABLE pantry
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Initialize updated_at to created_at for existing rows
UPDATE pantry SET updated_at = created_at WHERE updated_at IS NULL;
