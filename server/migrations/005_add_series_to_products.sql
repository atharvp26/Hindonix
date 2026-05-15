-- Add series column to products table for Minimal/Classical filtering
ALTER TABLE products ADD COLUMN IF NOT EXISTS series VARCHAR(100) NULL AFTER name;
