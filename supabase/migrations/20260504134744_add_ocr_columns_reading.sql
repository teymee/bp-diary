-- Step 1: add columns
ALTER TABLE readings
ADD COLUMN source text DEFAULT 'manual',
ADD COLUMN image_url text;

-- Step 2: backfill existing rows (safety)
UPDATE readings
SET source = 'manual'
WHERE source IS NULL;

-- Step 3: enforce NOT NULL on source
ALTER TABLE readings
ALTER COLUMN source SET NOT NULL;