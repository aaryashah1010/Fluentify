# Conflicts Between Epics

## Epic 1 (Documentation, DB Setup & Authentication)
Contains foundational elements (registration, login, profile).

### Conflict with Epic 2 (Dashboards)
If the profile schema or authentication model isn’t finalized in Epic 1, later dashboard features (filters, curriculum, analytics) in Epic 2 may break or require rework.

**Example:** Profile fields collected in Epic 1 (e.g., goals, proficiency) must align with what Epic 2 uses for AI curriculum and filtering.

---

## Epic 2 (User & Admin Dashboards)
Contains learner-facing dashboard + admin dashboard.

### Conflict with Epic 3 (Gamification & Contests)
Dashboards may need redesign later to integrate gamification widgets, leaderboards, and progress reports. If dashboards are built too rigidly in Epic 2, Epic 3 features will cause UI/UX inconsistencies or require rework.

### Conflict with Epic 4 (Agentic AI)
Dashboards must show AI-triggered reminders, motivational messages, or adaptive learning insights. If Epic 2 does not plan for placeholders/notifications, integration in Epic 4 may feel bolted-on instead of seamless.

---

## Epic 3 (Gamification & Competitions)
Adds gamification, role-play progress tracking, leaderboards, contests.

### Conflict with Epic 2 (Dashboards)
Leaderboards and streaks rely heavily on analytics and progress data from dashboards (Epic 2). If data models differ, leaderboard scores may not align with progress tracking.

### Conflict with Epic 4 (Agentic AI)
Motivational messages in Epic 4 could overlap/conflict with gamification notifications (e.g., system sends a “You lost your streak” alert + AI sends “Keep going!” message). Poor coordination may overwhelm learners.

---

## Epic 4 (Final Integration: Agentic AI)
Adds automated reminders, adaptive difficulty, motivational nudges.

### Conflict with Epic 2 (Dashboards)
Dashboards must display AI-driven changes (like difficulty shifts or reminder logs). If Epic 2 hardcodes curriculum/progress views, they may not reflect adaptive changes from Epic 4.

### Conflict with Epic 3 (Gamification & Contests)
Automated reminders may spam learners about contests, badges, or streaks → creating notification fatigue.

### Conflict with Epic 1 (Authentication/Data)
AI automations require access to learner activity logs. If activity tracking wasn’t included in the early schema, Epic 4 won’t have the data it needs.

---

## Summary of Conflicts Between Epics

* **Epic 1 ↔ Epic 2 →** Profile & authentication schema consistency.
* **Epic 2 ↔ Epic 3 →** Dashboards may not anticipate gamification & contest integration.
* **Epic 2 ↔ Epic 4 →** Dashboards may not support adaptive/AI notifications.
* **Epic 3 ↔ Epic 4 →** Gamification alerts + AI reminders risk overwhelming learners.
* **Epic 1 ↔ Epic 4 →** Lack of early activity logging prevents AI automations later.
