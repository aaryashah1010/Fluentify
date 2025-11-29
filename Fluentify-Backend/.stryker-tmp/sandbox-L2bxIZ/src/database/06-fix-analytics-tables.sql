-- FIX: Standalone migration to create learning_logs table if it doesn't exist
-- This file can be run manually if the automatic migration didn't execute.
-- 
-- Problem: "Failed to load analytics data" error occurs when:
--   - Database was initialized before this migration existed
--   - Docker volume already existed when migration was added
--   - Migration script failed silently
--   - learning_logs table doesn't exist
--
-- Solution: Run this file manually via:
--   Option 1: psql -U postgres -d fluentify -f src/database/06-fix-analytics-tables.sql
--   Option 2: docker exec -i fluentify-postgres psql -U postgres -d fluentify < src/database/06-fix-analytics-tables.sql
--   Option 3: Use a migration script similar to fix-otp-codes.js

-- Create learning_logs table for analytics tracking
CREATE TABLE IF NOT EXISTS learning_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- e.g., 'LESSON_COMPLETED', 'AI_MODULE_GENERATED', 'ADMIN_MODULE_USED'
    language_name VARCHAR(100), -- The language being studied
    module_type VARCHAR(20) NOT NULL CHECK (module_type IN ('ADMIN', 'AI')),
    duration_seconds INTEGER, -- Time spent on the lesson
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB, -- For extra info like AI performance metrics, lesson details, etc.
    FOREIGN KEY (user_id) REFERENCES learners(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_learning_logs_user_id ON learning_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_logs_event_type ON learning_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_learning_logs_language ON learning_logs(language_name);
CREATE INDEX IF NOT EXISTS idx_learning_logs_module_type ON learning_logs(module_type);
CREATE INDEX IF NOT EXISTS idx_learning_logs_created_at ON learning_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_learning_logs_user_event ON learning_logs(user_id, event_type);

-- Verify table was created
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'learning_logs') THEN
        RAISE NOTICE '✅ learning_logs table created successfully!';
    ELSE
        RAISE EXCEPTION '❌ Failed to create learning_logs table';
    END IF;
END $$;

