# Contest Feature Implementation - Backend

## Overview
This document describes the complete backend implementation of the **Peer-to-Peer Leaderboard & Weekly Contest** feature for Fluentify.

## User Story
**Front**: As a learner, I want to compete with peers weekly, so that I stay motivated through competition.

**Back**: Given I complete lessons, When scores are calculated, Then leaderboards/weekly contest rankings should update in real time.

## Feature Flow
1. **Admin creates contest** - Draft status
2. **Admin adds MCQ questions** - With correct answers
3. **Admin publishes contest** - Makes it available to learners
4. **Contest becomes active** - At scheduled start time
5. **Learners participate** - During the time window
6. **Scores are calculated** - Based on correct answers and time taken
7. **Leaderboard updates** - Real-time ranking by score and time
8. **Contest ends** - Learners can still view results and leaderboard

## Database Schema

### Tables Created/Modified

#### 1. `learners` table (Modified)
```sql
ALTER TABLE learners ADD COLUMN contest_name VARCHAR(50);
```
- Added `contest_name` field for custom display names in contests
- Defaults to user's regular name if not set

#### 2. `contests` table (Enhanced)
```sql
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
```

#### 3. `contest_questions` table (New)
```sql
CREATE TABLE IF NOT EXISTS contest_questions (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- [{"id": 0, "text": "Option A"}, {"id": 1, "text": "Option B"}]
  correct_option_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. `contest_scores` table (New)
```sql
CREATE TABLE IF NOT EXISTS contest_scores (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  time_taken_ms BIGINT NOT NULL, -- For tie-breaking
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(learner_id, contest_id)
);
```

#### 5. `contest_submissions` table (New)
```sql
CREATE TABLE IF NOT EXISTS contest_submissions (
  id SERIAL PRIMARY KEY,
  learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES contest_questions(id) ON DELETE CASCADE,
  selected_option_id INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes Created
```sql
CREATE INDEX IF NOT EXISTS idx_contests_status ON contests(status);
CREATE INDEX IF NOT EXISTS idx_contests_time ON contests(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_contest_questions_contest ON contest_questions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_scores_contest ON contest_scores(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_scores_learner ON contest_scores(learner_id);
CREATE INDEX IF NOT EXISTS idx_contest_scores_leaderboard ON contest_scores(contest_id, score DESC, time_taken_ms ASC);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_learner ON contest_submissions(learner_id, contest_id);
```

## API Endpoints

### Admin Endpoints

#### 1. Create Contest
```
POST /api/contests/admin
Authorization: Bearer <admin_token>

Request Body:
{
  "title": "Weekly Spanish Challenge",
  "description": "Test your Spanish skills!",
  "start_time": "2024-11-20T10:00:00Z",
  "end_time": "2024-11-20T11:00:00Z"
}

Response:
{
  "success": true,
  "message": "Contest created successfully",
  "data": { contest object }
}
```

#### 2. Add Question to Contest
```
POST /api/contests/admin/:contestId/questions
Authorization: Bearer <admin_token>

Request Body:
{
  "question_text": "What is 'Hello' in Spanish?",
  "options": [
    {"id": 0, "text": "Hola"},
    {"id": 1, "text": "Adiós"},
    {"id": 2, "text": "Gracias"},
    {"id": 3, "text": "Por favor"}
  ],
  "correct_option_id": 0
}

Response:
{
  "success": true,
  "message": "Question added successfully",
  "data": { question object }
}
```

#### 3. Publish Contest
```
PATCH /api/contests/admin/:contestId/publish
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Contest published successfully",
  "data": { contest object with status: "PUBLISHED" }
}
```

#### 4. Get All Contests (Admin View)
```
GET /api/contests/admin
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Contests retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Weekly Spanish Challenge",
      "status": "PUBLISHED",
      "question_count": 10,
      "participant_count": 25,
      ...
    }
  ]
}
```

#### 5. Get Contest Details (Admin View)
```
GET /api/contests/admin/:contestId
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Contest details retrieved successfully",
  "data": {
    "id": 1,
    "title": "Weekly Spanish Challenge",
    "questions": [ array of questions with correct answers ]
  }
}
```

#### 6. Delete Contest
```
DELETE /api/contests/admin/:contestId
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Contest deleted successfully"
}
```

### Learner Endpoints

#### 1. Get Available Contests
```
GET /api/contests
Authorization: Bearer <learner_token>

Response:
{
  "success": true,
  "message": "Available contests retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Weekly Spanish Challenge",
      "description": "Test your Spanish skills!",
      "start_time": "2024-11-20T10:00:00Z",
      "end_time": "2024-11-20T11:00:00Z",
      "status": "ACTIVE",
      "question_count": 10,
      "participant_count": 25
    }
  ]
}
```

#### 2. Get Contest for Participation
```
GET /api/contests/:contestId
Authorization: Bearer <learner_token>

Response:
{
  "success": true,
  "message": "Contest details retrieved successfully",
  "data": {
    "contest": {
      "id": 1,
      "title": "Weekly Spanish Challenge",
      "description": "Test your Spanish skills!",
      "start_time": "2024-11-20T10:00:00Z",
      "end_time": "2024-11-20T11:00:00Z"
    },
    "questions": [
      {
        "id": 1,
        "question_text": "What is 'Hello' in Spanish?",
        "options": [
          {"id": 0, "text": "Hola"},
          {"id": 1, "text": "Adiós"},
          {"id": 2, "text": "Gracias"},
          {"id": 3, "text": "Por favor"}
        ]
        // Note: correct_option_id is NOT included
      }
    ]
  }
}
```

#### 3. Submit Contest
```
POST /api/contests/:contestId/submit
Authorization: Bearer <learner_token>

Request Body:
{
  "start_time": 1700478000000, // Timestamp when user started
  "submissions": [
    {
      "question_id": 1,
      "selected_option_id": 0
    },
    {
      "question_id": 2,
      "selected_option_id": 2
    }
  ]
}

Response:
{
  "success": true,
  "message": "Contest submitted successfully",
  "data": {
    "score": 8,
    "total_questions": 10,
    "time_taken_ms": 245000,
    "rank": 3,
    "total_participants": 25
  }
}
```

#### 4. Get Leaderboard
```
GET /api/contests/:contestId/leaderboard
Authorization: Bearer <learner_token>

Response:
{
  "success": true,
  "message": "Leaderboard retrieved successfully",
  "data": {
    "contest": {
      "id": 1,
      "title": "Weekly Spanish Challenge",
      "status": "ENDED"
    },
    "leaderboard": [
      {
        "rank": 1,
        "learner_id": 5,
        "display_name": "SpeedyGonzales", // contest_name or name
        "score": 10,
        "time_taken_ms": 180000,
        "submitted_at": "2024-11-20T10:15:00Z"
      },
      {
        "rank": 2,
        "learner_id": 12,
        "display_name": "John Doe",
        "score": 10,
        "time_taken_ms": 195000,
        "submitted_at": "2024-11-20T10:18:00Z"
      }
    ]
  }
}
```

#### 5. Get User's Contest History
```
GET /api/contests/my-contests
Authorization: Bearer <learner_token>

Response:
{
  "success": true,
  "message": "Contest history retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Weekly Spanish Challenge",
      "score": 8,
      "time_taken_ms": 245000,
      "rank": 3,
      "total_participants": 25,
      "submitted_at": "2024-11-20T10:20:00Z"
    }
  ]
}
```

#### 6. Get User's Contest Result Details
```
GET /api/contests/:contestId/my-result
Authorization: Bearer <learner_token>

Response:
{
  "success": true,
  "message": "Contest result retrieved successfully",
  "data": {
    "contest": {
      "id": 1,
      "title": "Weekly Spanish Challenge",
      "status": "ENDED"
    },
    "result": {
      "score": 8,
      "time_taken_ms": 245000,
      "rank": 3,
      "total_participants": 25,
      "submitted_at": "2024-11-20T10:20:00Z"
    },
    "submissions": [
      {
        "question_id": 1,
        "question_text": "What is 'Hello' in Spanish?",
        "selected_option_id": 0,
        "correct_option_id": 0,
        "is_correct": true,
        "options": [...]
      }
    ]
  }
}
```

### Profile Update Endpoint (Enhanced)

#### Update Profile with Contest Name
```
PATCH /api/auth/profile
Authorization: Bearer <learner_token>

Request Body:
{
  "name": "John Doe",           // Optional
  "contest_name": "JohnTheWiz"  // Optional
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "contest_name": "JohnTheWiz",
      ...
    }
  }
}
```

## File Structure

```
Fluentify-Backend/src/
├── database/
│   ├── 01-tables.sql (Modified - added contest_name to learners)
│   └── 02-tables.sql (Modified - added contest tables)
├── repositories/
│   ├── authRepository.js (Modified - contest_name support)
│   └── contestRepository.js (New)
├── services/
│   └── contestService.js (New)
├── controllers/
│   ├── authController.js (Modified - contest_name in profile)
│   └── contestController.js (New)
├── routes/
│   └── contest.js (New)
└── server.js (Modified - registered contest routes)
```

## Business Logic

### Contest Status Flow
1. **DRAFT** - Initial state, admin can add/edit questions
2. **PUBLISHED** - Visible to learners, waiting for start time
3. **ACTIVE** - Contest is running (between start_time and end_time)
4. **ENDED** - Contest finished, results are final

Status transitions happen automatically based on current time when contests are accessed.

### Scoring System
- **Score**: Number of correct answers
- **Tie-breaking**: Time taken in milliseconds (faster is better)
- **Ranking**: ORDER BY score DESC, time_taken_ms ASC

### Leaderboard Logic
```sql
SELECT 
  COALESCE(l.contest_name, l.name) AS display_name,
  cs.score,
  cs.time_taken_ms,
  ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.time_taken_ms ASC) as rank
FROM contest_scores cs
JOIN learners l ON l.id = cs.learner_id
WHERE cs.contest_id = $1
ORDER BY cs.score DESC, cs.time_taken_ms ASC
```

## Security & Validation

### Admin-Only Operations
- Create contest
- Add questions
- Publish contest
- Delete contest
- View all contests with admin details

Protected by `adminOnly` middleware.

### Learner Restrictions
- Can only participate during active contest time
- Cannot submit twice for the same contest
- Cannot see correct answers until after submission
- Time tracking prevents cheating

### Validation Rules
- Contest start_time must be in the future
- Contest end_time must be after start_time
- Questions must have at least 2 options
- Correct option ID must exist in options array
- Contest must have questions before publishing
- Contest name max 50 characters

## Error Handling

All endpoints use centralized error handling:
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (admin access required, contest not active, already submitted)
- **404** - Not Found (contest/question not found)
- **500** - Internal Server Error

## Testing Recommendations

### Admin Flow
1. Create a contest
2. Add multiple questions
3. Try to publish without questions (should fail)
4. Add questions and publish
5. Verify contest appears in learner's available contests

### Learner Flow
1. Get available contests
2. Try to access contest before start time (should fail)
3. Access contest during active time
4. Submit answers with timing
5. View leaderboard
6. View personal results
7. Try to submit again (should fail)

### Edge Cases
- Contest status transitions at exact start/end times
- Multiple users submitting simultaneously
- Tie-breaking with identical scores
- Empty leaderboards
- Contest name vs regular name display

## Performance Considerations

### Indexes
All critical queries are optimized with indexes:
- Contest status lookups
- Time-based queries
- Leaderboard sorting (score + time)
- User participation checks

### Caching Opportunities (Future)
- Leaderboards for ended contests
- Available contests list
- Contest questions (during active period)

## Future Enhancements

1. **Real-time Updates**: WebSocket support for live leaderboard
2. **Rewards System**: Automatic XP/badge distribution
3. **Contest Categories**: Filter by language/difficulty
4. **Recurring Contests**: Weekly auto-generation
5. **Team Contests**: Group competitions
6. **Analytics Dashboard**: Admin insights on participation
7. **Question Bank**: Reusable question library
8. **Difficulty Levels**: Weighted scoring

## Migration Instructions

To apply the database changes:

```bash
# Connect to your PostgreSQL database
psql -U your_user -d fluentify_db

# Run the migration files in order
\i src/database/01-tables.sql
\i src/database/02-tables.sql
```

Or if using Docker:
```bash
docker exec -i fluentify-db psql -U postgres -d fluentify < src/database/01-tables.sql
docker exec -i fluentify-db psql -U postgres -d fluentify < src/database/02-tables.sql
```

## Conclusion

The contest feature is fully implemented and ready for frontend integration. All endpoints follow RESTful conventions and include proper authentication, authorization, and validation.
