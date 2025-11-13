CREATE TABLE IF NOT EXISTS language_modules (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  language VARCHAR(100) NOT NULL,
  level VARCHAR(50), -- e.g., Beginner, Intermediate, Advanced
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  estimated_duration VARCHAR(100),
  total_units INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_units (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES language_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  estimated_time INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS module_lessons (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES module_units(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,  -- e.g., reading, listening, quiz, conversation
  description TEXT,
  media_url TEXT,  -- video/audio
  key_phrases TEXT[],
  vocabulary JSONB,
  grammar_points JSONB,
  exercises JSONB,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learner_enrollments (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES language_modules(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  progress_percentage INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE (learner_id, module_id)
);
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
  language VARCHAR(50),
  session_token VARCHAR(100) UNIQUE NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- chatbot
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
  session_token VARCHAR(100) UNIQUE NOT NULL,  -- e.g., UUID for each new chat
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);


CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(20) CHECK (sender IN ('learner', 'ai')),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION cleanup_ai_sessions(p_learner_id INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM ai_chat_messages WHERE session_id IN (
    SELECT id FROM ai_chat_sessions WHERE learner_id = p_learner_id
  );
  DELETE FROM ai_chat_sessions WHERE learner_id = p_learner_id;
END;
$$ LANGUAGE plpgsql;

--gamification
CREATE TABLE IF NOT EXISTS leaderboards (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  rank INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (learner_id, week_start)
);
-- Contest Management System
CREATE TABLE IF NOT EXISTS contests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ACTIVE, ENDED
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Contest Questions (MCQ type)
CREATE TABLE IF NOT EXISTS contest_questions (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- e.g., [{"id": 0, "text": "Option A"}, {"id": 1, "text": "Option B"}]
  correct_option_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Contest Scores (one entry per user per contest)
CREATE TABLE IF NOT EXISTS contest_scores (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  time_taken_ms BIGINT NOT NULL, -- Time in milliseconds for tie-breaking
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(learner_id, contest_id)
);

-- Contest Submissions (individual answers for review)
CREATE TABLE IF NOT EXISTS contest_submissions (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES contest_questions(id) ON DELETE CASCADE,
  selected_option_id INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Legacy contest participants table (kept for backward compatibility)
CREATE TABLE IF NOT EXISTS contest_participants (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER REFERENCES contests(id) ON DELETE CASCADE,
  learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (contest_id, learner_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'reminder',  -- e.g., 'reminder', 'milestone', 'warning'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Contest Performance
CREATE INDEX IF NOT EXISTS idx_contests_status ON contests(status);
CREATE INDEX IF NOT EXISTS idx_contests_time ON contests(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_contest_questions_contest ON contest_questions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_scores_contest ON contest_scores(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_scores_learner ON contest_scores(learner_id);
CREATE INDEX IF NOT EXISTS idx_contest_scores_leaderboard ON contest_scores(contest_id, score DESC, time_taken_ms ASC);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_learner ON contest_submissions(learner_id, contest_id);
