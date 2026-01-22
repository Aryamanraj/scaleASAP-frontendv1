-- Clean up duplicate experiments, keeping only the 5 most recent per workspace
-- This removes experiments that were created from multiple test runs

-- Option 1: Delete all experiments older than the 5 most recent ones
DELETE FROM experiments
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY workspace_id 
                ORDER BY created_at DESC
            ) as row_num
        FROM experiments
    ) ranked
    WHERE row_num > 5
);

-- Option 2 (safer): If you want to delete ALL experiments and start fresh
-- DELETE FROM experiments WHERE workspace_id = 'your-workspace-id-here';

-- After cleanup, verify the count
SELECT workspace_id, COUNT(*) as experiment_count
FROM experiments
GROUP BY workspace_id;
