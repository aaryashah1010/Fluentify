# Admin API Documentation

This document describes the RESTful API endpoints for admin content management in the Fluentify backend.

## Authentication

All admin endpoints require:
1. **Authentication**: Valid JWT token in the `Authorization` header
2. **Admin Role**: The authenticated user must have `role: 'admin'`

### Headers
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Error Responses
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Base URL
```
http://localhost:5000/api/admin
```

---

## Language Endpoints

### 1. Get All Languages
Get a list of all unique languages with course counts.

**Endpoint:** `GET /languages`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "language": "Spanish",
      "course_count": "5"
    },
    {
      "language": "French",
      "course_count": "3"
    }
  ]
}
```

### 2. Get Courses by Language
Get all courses for a specific language.

**Endpoint:** `GET /languages/:lang/courses`

**Parameters:**
- `lang` (path): Language name (e.g., "Spanish")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "admin_id": 1,
      "language": "Spanish",
      "level": "Beginner",
      "title": "Spanish for Beginners",
      "description": "Learn Spanish from scratch",
      "thumbnail_url": "https://example.com/image.jpg",
      "estimated_duration": "3 months",
      "total_units": 5,
      "total_lessons": 25,
      "is_published": true,
      "unit_count": "5",
      "lesson_count": "25",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Course Endpoints

### 3. Create Course
Create a new language course.

**Endpoint:** `POST /courses`

**Request Body:**
```json
{
  "language": "Spanish",
  "level": "Beginner",
  "title": "Spanish for Beginners",
  "description": "Learn Spanish from scratch",
  "thumbnail_url": "https://example.com/image.jpg",
  "estimated_duration": "3 months",
  "is_published": false
}
```

**Required Fields:**
- `language` (string): Language name
- `level` (string): Course level (e.g., "Beginner", "Intermediate", "Advanced")
- `title` (string): Course title

**Optional Fields:**
- `description` (string): Course description
- `thumbnail_url` (string): URL to course thumbnail
- `estimated_duration` (string): Estimated time to complete
- `is_published` (boolean): Whether the course is published (default: false)

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 1,
    "admin_id": 1,
    "language": "Spanish",
    "level": "Beginner",
    "title": "Spanish for Beginners",
    "description": "Learn Spanish from scratch",
    "thumbnail_url": "https://example.com/image.jpg",
    "estimated_duration": "3 months",
    "total_units": 0,
    "total_lessons": 0,
    "is_published": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Get Course Details
Get detailed information about a course including all units and lessons.

**Endpoint:** `GET /courses/:courseId`

**Parameters:**
- `courseId` (path): Course ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "admin_id": 1,
    "language": "Spanish",
    "level": "Beginner",
    "title": "Spanish for Beginners",
    "description": "Learn Spanish from scratch",
    "thumbnail_url": "https://example.com/image.jpg",
    "estimated_duration": "3 months",
    "total_units": 2,
    "total_lessons": 5,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "units": [
      {
        "id": 1,
        "module_id": 1,
        "title": "Introduction to Spanish",
        "description": "Basic greetings and phrases",
        "difficulty": "Beginner",
        "estimated_time": 30,
        "lesson_count": "3",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "lessons": [
          {
            "id": 1,
            "unit_id": 1,
            "title": "Greetings",
            "content_type": "reading",
            "description": "Learn basic greetings",
            "media_url": null,
            "key_phrases": ["Hola", "Buenos días"],
            "vocabulary": {"hello": "hola"},
            "grammar_points": {},
            "exercises": {},
            "xp_reward": 10,
            "created_at": "2024-01-01T00:00:00.000Z",
            "updated_at": "2024-01-01T00:00:00.000Z"
          }
        ]
      }
    ]
  }
}
```

### 5. Update Course
Update an existing course.

**Endpoint:** `PUT /courses/:courseId`

**Parameters:**
- `courseId` (path): Course ID

**Request Body:** (all fields optional)
```json
{
  "language": "Spanish",
  "level": "Intermediate",
  "title": "Updated Title",
  "description": "Updated description",
  "thumbnail_url": "https://example.com/new-image.jpg",
  "estimated_duration": "4 months",
  "is_published": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": 1,
    "admin_id": 1,
    "language": "Spanish",
    "level": "Intermediate",
    "title": "Updated Title",
    "description": "Updated description",
    "thumbnail_url": "https://example.com/new-image.jpg",
    "estimated_duration": "4 months",
    "total_units": 2,
    "total_lessons": 5,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

### 6. Delete Course
Delete a course (will cascade delete all units and lessons).

**Endpoint:** `DELETE /courses/:courseId`

**Parameters:**
- `courseId` (path): Course ID

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "id": 1,
    "admin_id": 1,
    "language": "Spanish",
    "level": "Beginner",
    "title": "Spanish for Beginners",
    "description": "Learn Spanish from scratch",
    "thumbnail_url": "https://example.com/image.jpg",
    "estimated_duration": "3 months",
    "total_units": 2,
    "total_lessons": 5,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Unit Endpoints

### 7. Create Unit
Add a new unit to a course.

**Endpoint:** `POST /courses/:courseId/units`

**Parameters:**
- `courseId` (path): Course ID

**Request Body:**
```json
{
  "title": "Introduction to Spanish",
  "description": "Basic greetings and phrases",
  "difficulty": "Beginner",
  "estimated_time": 30
}
```

**Required Fields:**
- `title` (string): Unit title

**Optional Fields:**
- `description` (string): Unit description
- `difficulty` (string): Difficulty level (default: "Beginner")
- `estimated_time` (integer): Estimated time in minutes (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Unit created successfully",
  "data": {
    "id": 1,
    "module_id": 1,
    "title": "Introduction to Spanish",
    "description": "Basic greetings and phrases",
    "difficulty": "Beginner",
    "estimated_time": 30,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Update Unit
Update an existing unit.

**Endpoint:** `PUT /units/:unitId`

**Parameters:**
- `unitId` (path): Unit ID

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Unit Title",
  "description": "Updated description",
  "difficulty": "Intermediate",
  "estimated_time": 45
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unit updated successfully",
  "data": {
    "id": 1,
    "module_id": 1,
    "title": "Updated Unit Title",
    "description": "Updated description",
    "difficulty": "Intermediate",
    "estimated_time": 45,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

### 9. Delete Unit
Delete a unit (will cascade delete all lessons).

**Endpoint:** `DELETE /units/:unitId`

**Parameters:**
- `unitId` (path): Unit ID

**Response:**
```json
{
  "success": true,
  "message": "Unit deleted successfully",
  "data": {
    "id": 1,
    "module_id": 1,
    "title": "Introduction to Spanish",
    "description": "Basic greetings and phrases",
    "difficulty": "Beginner",
    "estimated_time": 30,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Lesson Endpoints

### 10. Create Lesson
Add a new lesson to a unit.

**Endpoint:** `POST /units/:unitId/lessons`

**Parameters:**
- `unitId` (path): Unit ID

**Request Body:**
```json
{
  "title": "Greetings",
  "content_type": "reading",
  "description": "Learn basic greetings",
  "media_url": "https://example.com/video.mp4",
  "key_phrases": ["Hola", "Buenos días", "Buenas tardes"],
  "vocabulary": {
    "hello": "hola",
    "good_morning": "buenos días"
  },
  "grammar_points": {
    "formal_vs_informal": "Use 'usted' for formal situations"
  },
  "exercises": {
    "questions": [
      {
        "type": "multiple_choice",
        "question": "How do you say 'hello' in Spanish?",
        "options": ["Hola", "Adiós", "Gracias"],
        "correct": "Hola"
      }
    ]
  },
  "xp_reward": 10
}
```

**Required Fields:**
- `title` (string): Lesson title
- `content_type` (string): Type of content (e.g., "reading", "listening", "quiz", "conversation")

**Optional Fields:**
- `description` (string): Lesson description
- `media_url` (string): URL to media (video/audio)
- `key_phrases` (array): Array of key phrases
- `vocabulary` (object): Vocabulary items
- `grammar_points` (object): Grammar explanations
- `exercises` (object): Exercise data
- `xp_reward` (integer): XP points awarded (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": 1,
    "unit_id": 1,
    "title": "Greetings",
    "content_type": "reading",
    "description": "Learn basic greetings",
    "media_url": "https://example.com/video.mp4",
    "key_phrases": ["Hola", "Buenos días", "Buenas tardes"],
    "vocabulary": {
      "hello": "hola",
      "good_morning": "buenos días"
    },
    "grammar_points": {
      "formal_vs_informal": "Use 'usted' for formal situations"
    },
    "exercises": {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "How do you say 'hello' in Spanish?",
          "options": ["Hola", "Adiós", "Gracias"],
          "correct": "Hola"
        }
      ]
    },
    "xp_reward": 10,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 11. Update Lesson
Update an existing lesson.

**Endpoint:** `PUT /lessons/:lessonId`

**Parameters:**
- `lessonId` (path): Lesson ID

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Lesson Title",
  "content_type": "listening",
  "description": "Updated description",
  "media_url": "https://example.com/new-video.mp4",
  "key_phrases": ["Hola", "¿Cómo estás?"],
  "vocabulary": {
    "hello": "hola",
    "how_are_you": "¿cómo estás?"
  },
  "grammar_points": {},
  "exercises": {},
  "xp_reward": 15
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {
    "id": 1,
    "unit_id": 1,
    "title": "Updated Lesson Title",
    "content_type": "listening",
    "description": "Updated description",
    "media_url": "https://example.com/new-video.mp4",
    "key_phrases": ["Hola", "¿Cómo estás?"],
    "vocabulary": {
      "hello": "hola",
      "how_are_you": "¿cómo estás?"
    },
    "grammar_points": {},
    "exercises": {},
    "xp_reward": 15,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

### 12. Delete Lesson
Delete a lesson.

**Endpoint:** `DELETE /lessons/:lessonId`

**Parameters:**
- `lessonId` (path): Lesson ID

**Response:**
```json
{
  "success": true,
  "message": "Lesson deleted successfully",
  "data": {
    "id": 1,
    "unit_id": 1,
    "title": "Greetings",
    "content_type": "reading",
    "description": "Learn basic greetings",
    "media_url": "https://example.com/video.mp4",
    "key_phrases": ["Hola", "Buenos días", "Buenas tardes"],
    "vocabulary": {
      "hello": "hola",
      "good_morning": "buenos días"
    },
    "grammar_points": {
      "formal_vs_informal": "Use 'usted' for formal situations"
    },
    "exercises": {},
    "xp_reward": 10,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Content Types

The following content types are supported for lessons:
- `reading`: Text-based reading lessons
- `listening`: Audio-based listening lessons
- `quiz`: Quiz or assessment lessons
- `conversation`: Conversation practice lessons
- `video`: Video-based lessons
- `grammar`: Grammar-focused lessons
- `vocabulary`: Vocabulary-focused lessons

---

## Workflow Example

### Creating a Complete Course

1. **Create a Course**
   ```
   POST /api/admin/courses
   ```

2. **Add Units to the Course**
   ```
   POST /api/admin/courses/1/units
   POST /api/admin/courses/1/units
   ```

3. **Add Lessons to Each Unit**
   ```
   POST /api/admin/units/1/lessons
   POST /api/admin/units/1/lessons
   POST /api/admin/units/2/lessons
   ```

4. **Publish the Course**
   ```
   PUT /api/admin/courses/1
   { "is_published": true }
   ```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The `total_units` and `total_lessons` fields in courses are automatically updated when units/lessons are added or deleted
- Deleting a course will cascade delete all associated units and lessons
- Deleting a unit will cascade delete all associated lessons
- JSONB fields (`vocabulary`, `grammar_points`, `exercises`) can store complex nested objects
- The `key_phrases` field is a PostgreSQL array of strings

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common error scenarios:
- Missing required fields: 400 Bad Request
- Resource not found: 404 Not Found
- Unauthorized access: 401 Unauthorized
- Forbidden (non-admin): 403 Forbidden
- Server errors: 500 Internal Server Error
