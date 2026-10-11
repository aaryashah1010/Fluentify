-- Link chat sessions to a specific course, so a learner can have one ongoing
-- conversation per course (resumed each time, instead of always starting fresh).
-- Nullable: existing/general chat sessions (not opened from a specific course) keep course_id = NULL.

ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_chat_sessions_course_id ON chat_sessions(course_id);
