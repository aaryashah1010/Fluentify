# Contest API Quick Reference

## Base URL
```
http://localhost:5000/api/contests
```

## Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/admin` | Create contest | Admin |
| POST | `/admin/:contestId/questions` | Add question | Admin |
| PATCH | `/admin/:contestId/publish` | Publish contest | Admin |
| GET | `/admin` | Get all contests | Admin |
| GET | `/admin/:contestId` | Get contest details | Admin |
| DELETE | `/admin/:contestId` | Delete contest | Admin |

## Learner Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get available contests | Learner |
| GET | `/:contestId` | Get contest to participate | Learner |
| POST | `/:contestId/submit` | Submit contest answers | Learner |
| GET | `/:contestId/leaderboard` | Get leaderboard | Learner |
| GET | `/my-contests` | Get user's contest history | Learner |
| GET | `/:contestId/my-result` | Get user's result details | Learner |

## Profile Endpoint (Enhanced)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PATCH | `/api/auth/profile` | Update profile (includes contest_name) | Learner |

## Request/Response Examples

### Create Contest (Admin)
```javascript
// POST /api/contests/admin
{
  "title": "Weekly Spanish Challenge",
  "description": "Test your Spanish skills!",
  "start_time": "2024-11-20T10:00:00Z",
  "end_time": "2024-11-20T11:00:00Z"
}
```

### Add Question (Admin)
```javascript
// POST /api/contests/admin/:contestId/questions
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
```

### Submit Contest (Learner)
```javascript
// POST /api/contests/:contestId/submit
{
  "start_time": 1700478000000,
  "submissions": [
    {"question_id": 1, "selected_option_id": 0},
    {"question_id": 2, "selected_option_id": 2}
  ]
}
```

### Update Profile with Contest Name
```javascript
// PATCH /api/auth/profile
{
  "name": "John Doe",           // Optional
  "contest_name": "JohnTheWiz"  // Optional
}
```

## Contest Status Values
- `DRAFT` - Being created by admin
- `PUBLISHED` - Visible to learners, not started yet
- `ACTIVE` - Currently running
- `ENDED` - Finished, results available

## Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token)
- `403` - Forbidden (wrong role, contest not active, already submitted)
- `404` - Not Found (contest doesn't exist)
- `500` - Server Error

## Important Notes

1. **Contest Name**: Learners can set a custom `contest_name` for leaderboard display. If not set, their regular `name` is used.

2. **Time Tracking**: Frontend must send `start_time` (timestamp) when submitting to calculate `time_taken_ms` for tie-breaking.

3. **One Submission**: Each learner can only submit once per contest. Subsequent attempts will return 400 error.

4. **Status Auto-Update**: Contest status automatically transitions from PUBLISHED → ACTIVE → ENDED based on current time.

5. **Leaderboard Ranking**: Sorted by score (descending), then time_taken_ms (ascending).

6. **Questions Access**: 
   - Learners see questions WITHOUT correct answers during participation
   - After submission, they can see their answers with correct/incorrect status
   - Admins always see correct answers

7. **Time Window**: Learners can only access and submit contests during the active time window (between start_time and end_time).
