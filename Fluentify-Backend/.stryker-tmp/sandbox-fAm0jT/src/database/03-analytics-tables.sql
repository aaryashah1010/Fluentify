

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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_learning_logs_user_id ON learning_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_logs_event_type ON learning_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_learning_logs_language ON learning_logs(language_name);
CREATE INDEX IF NOT EXISTS idx_learning_logs_module_type ON learning_logs(module_type);
CREATE INDEX IF NOT EXISTS idx_learning_logs_created_at ON learning_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_learning_logs_user_event ON learning_logs(user_id, event_type);
