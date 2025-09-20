# Fluentify: Language Learning App
This document provides an overview of our project.

## Table of Contents
1.  Stakeholder Identification
    * 1.1. Learners (Students)
    * 1.2. Admin (Platform Manager)
    * 1.3. AI Instructor Module
    * 1.4. Development Team
2.  Requirement Elicitation Methodology
    * 2.1. Techniques for Functional Requirements (FRs)
    * 2.2. Techniques for Non-Functional Requirements (NFRs)
3.  User Stories and Requirements
    * 3.1. Functional Requirements (FRs)
    * 3.2. Non-Functional Requirements (NFRs)
4.  Epics & Sprints
    * 4.1. Epic 1: Foundation & Authentication
    * 4.2. Epic 2: User & Admin Dashboards
    * 4.3. Epic 3: Gamification & Competitions
    * 4.4. Epic 4: Final Integration: Agentic AI
5.  Conflict Analysis
    * 5.1. Conflicts Between User Stories
    * 5.2. Conflicts Between Epics
6.  Proof of Concept (POC) - Sprint 1
    * 6.1. Sprint Goal & Objective
    * 6.2. Features Completed
    * 6.3. Security Implementations
    * 6.4. Testing & Verification
    * 6.5. Process and Deliverables
    * 6.6. Sprint Outcome

---

## 1. Stakeholder Identification
This section outlines the key stakeholders for the Fluentify project and the techniques used to identify them.

### 1.1. Learners (Students)
* **Technique Used:** Surveys & Brainstorming
* **Why Chosen:** As the main end-users, learners were identified through surveys. Their feedback, along with team brainstorming, highlighted that learners are the essential stakeholders since they influence the requirements for personalization, practice, and motivation.

### 1.2. Admin (Platform Manager)
* **Technique Used:** Brainstorming
* **Why Chosen:** During team discussions, we recognized the necessity of having someone to oversee the platform, manage users, and ensure its smooth operation. The project team is simulating this role, and the Admin stakeholder was introduced to represent the needs of system management.

### 1.3. AI Instructor Module (Conversational + Agentic AI)
* **Technique Used:** Analysis of Existing Systems & Brainstorming
* **Why Chosen:** By examining existing learning platforms (like Duolingo), we identified the significance of an AI tutor in enhancing the experience. Team brainstorming confirmed this as a vital module responsible for conversational practice, adaptive learning, and reminders.

### 1.4. Development Team
* **Technique Used:** Internal Brainstorming
* **Why Chosen:** As the individuals responsible for designing and implementing the system, the development team naturally emerged as a stakeholder. Brainstorming sessions validated their role in converting requirements into practical, usable features.

---

## 2. Requirement Elicitation Methodology
This section details the methods used to gather and define the project's functional and non-functional requirements.

### 2.1. Techniques for Functional Requirements (FRs)
* **FR-1: User Onboarding and Profile Management**
    * **Technique:** Prototyping
    * **Reason:** We developed a login/signup page and collected direct feedback. Creating and testing a working model was the main way we shaped the process for user registration and profile setup.
* **FR-2: Personalized and Adaptive Learning Path**
    * **Techniques:** Surveys & Interviews
    * **Reason:** Surveys highlighted that a lack of personalized learning was a significant issue for users. An adaptive learning plan was seen as a highly useful feature. Further details on the AI's logic came from interviews with our project mentor.
* **FR-3: Core Conversational Practice Engine**
    * **Techniques:** Brainstorming & Surveys
    * **Reason:** The concept of a conversational AI emerged from team brainstorming and was confirmed by survey responses, where "chatting with AI" was the most preferred learning method.
* **FR-4: Learner Engagement and Skill Tracking**
    * **Technique:** Surveys
    * **Reason:** Surveys confirmed that features for engagement are crucial. "Progress tracking" and "Gamification" were rated as highly valuable to combat the "Difficulty in staying motivated."
* **FR-5: Platform Administration and Content Management**
    * **Technique:** Brainstorming
    * **Reason:** As the project group is both the owner and developer, we internally defined all administrative requirements through collaborative brainstorming.
* **FR-6: Automated User Engagement and Reminders**
    * **Techniques:** Analysis of Existing Systems & Surveys
    * **Reason:** Analysis of successful applications showed that automated reminders boost user retention. This was supported by survey responses where users selected "Email Reminder" as a valuable feature.

### 2.2. Techniques for Non-Functional Requirements (NFRs)
* **NFR-1: System Performance and Scalability**
    * **Technique:** Brainstorming
    * **Reason:** Technical performance targets were set during internal brainstorming sessions to ensure a high-quality product that can scale.
* **NFR-2: Security and Privacy**
    * **Technique:** Analysis of Existing Systems
    * **Reason:** Security requirements are based on industry standards. We established the need for encryption by looking at how secure applications are built.
* **NFR-3: Usability and Accessibility**
    * **Techniques:** Prototyping & Surveys
    * **Reason:** Surveys showed that "Ease of use" and "Accessibility" were the most important aspects of an app. This aligns with feedback from prototyping.

---

## 3. User Stories and Requirements
This section details the specific functional and non-functional requirements.

### 3.1. Functional Requirements (FRs)
* **FR-1: User Onboarding and Profile Management**
    * **USL1: Learner Registration & Profile:** As a learner, I want to register with my details and goals, so that I can access a dashboard with a recommended learning path.
    * **USL2: User Profile Management (Admin):** As an admin, I want to manage learner profiles, so that I can monitor user progress.
    * **USL3: Login & Authentication System:** As a learner/admin, I want a secure login system, so that I can safely access the platform.
* **FR-2: Personalized and Adaptive Learning Path**
    * **USL4: Browse & Filter Languages:** As a learner, I want to browse and filter available languages, so that I can find the perfect course for my needs.
    * **USL5: AI-Generated Personalized Curriculum:** As a learner, I want the AI to suggest a personalized curriculum, so that I can learn step by step without confusion.
    * **USL6: Adaptive Difficulty:** As an AI instructor, I want to adjust difficulty in real time, so that learners are challenged but not overwhelmed.
* **FR-3: Core Conversational Practice Engine**
    * **USL7: Real-Time Chat with AI Tutor:** As a learner, I want to make conversation with the AI Tutor, so that I can practice fluency in any language.
    * **USL8: Pronunciation Feedback:** As a learner, I want real-time pronunciation feedback, so that I can improve how I sound.
    * **USL9: Real-Life Role-Play Scenarios:** As a learner, I want to role-play in real-world scenarios, so that I can apply language in context.
* **FR-4: Learner Engagement and Skill Tracking**
    * **USL10: Progress Report:** As a learner, I want to receive a detailed report of my vocabulary growth and fluency scores, so that I can clearly measure my progress over time.
    * **USL11: Gamification:** As a learner, I want gamification features (points, streaks, badges, leaderboards), so that I stay motivated.
    * **USL12: Peer-to-Peer Leaderboard & Weekly Contest:** As a learner, I want to compete with peers weekly, so that I stay motivated through competition.
* **FR-5: Platform Administration and Content Management**
    * **USL13: Manage Language Modules:** As an admin, I want to add, update, or delete language modules, so that content stays fresh and relevant.
    * **USL14: Analytics & Monitoring:** As an admin, I want to view analytics on learners, languages, and AI performance, so that I can understand usage trends.
* **FR-6: Automated User Engagement and Reminders**
    * **USL15: Help Bot:** As a learner, I want an in-chat help bot available on every screen, so that I can resolve platform issues anytime.
    * **USL16: AI Reminders & Feedback Automation:** As an admin, I want the AI to send motivational reminders and feedback so that learners stay engaged.
    * **USL17: Automated Emails & Motivational Messages:** As a learner, I want to receive reminders and motivational nudges, so that I can stay consistent.

### 3.2. Non-Functional Requirements (NFRs)
* **NFR-1: System Performance and Scalability**
    * **USNFR1: System Performance (Response Time):** As a learner, I want fast system responses, so that my learning experience feels smooth. (Response within 10s for general actions, 30-60s for AI replies).
    * **USNFR2: Scalability:** As an admin, I want the platform to handle 100+ concurrent learners without performance degradation.
* **NFR-2: Security and Privacy**
    * **USNFR3: Security & Privacy:** As a learner, I want my personal and payment data to be secure, so that I feel safe using the platform.
* **NFR-3: Usability and Accessibility**
    * **USNFR5: Usability:** As a learner, I want the interface to be simple and intuitive, so that I can focus on learning.
    * **USNFR6: Compatibility:** As a learner, I want the platform to work consistently on web (Chrome, Safari, Edge) and mobile (Android, iOS).

---

## 4. Epics & Sprints
This section breaks down the project into four main Epics, which are further divided into Sprints.

### Epic 1: Foundation & Authentication
* **Sprint 1: Documentation, DB Setup & Authentication**
    * USL1: Learner Registration & Profile
    * USL3: Login & Authentication System

### Epic 2: User & Admin Dashboards
* **Sprint 2: User Dashboard**
    * USL4: Browse & Filter Languages
    * USL5: AI-Generated Personalized Curriculum
    * USL7: Real-Time Chat with AI Tutor (basic text chat)
    * USL8: Pronunciation Feedback
    * USNFR1: System Performance
    * USNFR3: Security & Privacy
* **Sprint 3: Admin Dashboard**
    * USL2: User Profile Management (Admin)
    * USL13: Manage Language Modules
    * USL14: Analytics & Monitoring
    * USL15: Help Bot
    * USNFR2: Scalability
    * USNFR5: Usability
    * USNFR6: Compatibility

### Epic 3: Gamification & Competitions
* **Sprint 4: Gamification**
    * USL9: Real-Life Role-Play Scenarios
    * USL10: Progress Report
    * USL11: Gamification (points, streaks, badges)
* **Sprint 5: Leaderboards & Contests**
    * USL12: Peer-to-Peer Leaderboard & Weekly Contest

### Epic 4: Final Integration: Agentic AI
* **Sprint 6: Agentic AI Features**
    * USL16: AI Reminders & Feedback Automation
    * USL6: Adaptive Difficulty

---

## 5. Conflict Analysis
This section identifies potential conflicts between user stories and epics to mitigate risks during development.

### 5.1. Conflicts Between User Stories
1.  **Registration/Profile (USL1) vs. Admin User Profile Management (USL2):** Both create or update learner profile data.
2.  **AI-Generated Curriculum (USL5) vs. Adaptive Difficulty (USL6):** USL5 generates a static personalized curriculum at the start, while USL6 dynamically adapts it based on learner progress.
3.  **Real-Time Chat with AI Tutor (USL7) vs. Role-Play Scenarios (USL9):** Both involve conversation with AI but differ in context (free chat vs. structured role-play).
4.  **Gamification (USL11) vs. Leaderboards/Contests (USL12):** Both assign points and rewards, but criteria may differ.
5.  **Help Bot (USL15) vs. AI Tutor (USL7):** Both provide conversational support, but with different goals (learning vs. platform support).
6.  **Performance (USNFR1) vs. AI Features (USL5, USL7, USL9):** AI-generated responses, speech recognition, and adaptive difficulty may take more time than the NFR allows.

### 5.2. Conflicts Between Epics
* **Epic 1 vs. Epic 2:** If the profile schema or authentication model isn't finalized in Epic 1, later dashboard features (filters, curriculum, analytics) in Epic 2 may break or require rework.
* **Epic 1 vs. Epic 4:** Lack of early activity logging in the schema prevents AI automations later.
* **Epic 2 vs. Epic 3:** Dashboards may need redesign to integrate gamification widgets, leaderboards, and progress reports, causing UI/UX inconsistencies if built too rigidly.
* **Epic 2 vs. Epic 4:** Dashboards may not be designed to support AI-triggered reminders, motivational messages, or adaptive learning insights, making later integration feel bolted-on. Hardcoded views may not reflect adaptive changes from Epic 4.
* **Epic 3 vs. Epic 2:** Leaderboards and streaks rely heavily on analytics and progress data from dashboards. If data models differ, scores may not align.
* **Epic 3 vs. Epic 4:** Motivational messages in Epic 4 could overlap with gamification notifications, overwhelming learners.
* **Epic 4 vs. Epic 3:** Automated reminders may spam learners about contests, badges, or streaks, creating notification fatigue.

---

## 6. Proof of Concept (POC) - Sprint 1
This section details the implementation and outcomes of the first sprint.

### 6.1. Sprint Goal & Objective
* **Goal:** Design and implement the initial framework by developing the user interface, database schema, and authentication workflow (with validation and role-based access), along with a prototype dashboard to support learner onboarding and preferences.
* **Objective:** To implement the core authentication and onboarding workflow for the platform covering both frontend and backend components, including responsive UI, secure APIs, password encryption, JWT session management, and database schema setup.

### 6.2. Features Completed
1.  **Frontend Development**
    * **Sign-Up Page:** Includes email validation and strong password policy enforcement.
    * **Login Page:** Features credential validation and redirects to the dashboard on success.
    * **Dashboard (Prototype):** Provides an entry point post-login with placeholders for future modules.
    * **Routing & State Handling:** Utilizes React Router DOM for protected routes and JWT for session management.
    * **Styling & Standards:** Employs TailwindCSS for responsive UI and ESLint for code quality.
2.  **Backend Development**
    * **Database Setup:**
        * Tables Created: `learners`, `admins`, `learner_preferences`.
        * Migration Scripts: `Create_tables.sql`, `Create_learn_preferences.sql`.
    * **Authentication APIs (`/api/auth`):**
        * `POST /signup/learner`: Stores learner details with encrypted password. Returns JWT.
        * `POST /signup/admin`: Stores admin details securely. Returns JWT.
        * `POST /login/learner`: Validates credentials. Returns JWT.
        * `POST /login/admin`: Validates credentials. Returns JWT.
        * `GET /profile`: A protected route that validates JWT and returns user details.
    * **Preferences APIs (`/api/preferences`):**
        * `POST /learner`: Allows learners to store language and duration preferences.
        * `GET /learner`: Fetches learner preferences (role-based access enforced).
    * **Middleware & Server Setup:**
        * `authMiddleware.js`: For JWT verification and role extraction.
        * `db.js`: Centralized query helper for Postgres.
        * `server.js`: Express with CORS and JSON parsing.

### 6.3. Security Implementations
* Passwords hashed with bcrypt before storage.
* JWT signed with a secret key, expiring in 2 hours.
* Role-based access control (learner vs. admin).
* Protected routes require an `Authorization: Bearer` header.

### 6.4. Testing & Verification
* **Frontend:** Form validation (invalid email, weak passwords) and the login-to-dashboard flow were verified.
* **Backend:** Database connection was confirmed. All API endpoints were tested using Postman/Thunder Client. Unauthorized access attempts correctly returned 401/403 errors.

### 6.5. Process and Deliverables
* **Process:**
    * **Week 1:** Research, UI wireframe, Database design.
    * **Week 2:** Authentication module, Dashboard prototype, Documentation.
* **Deliverables:**
    * UI wireframe
    * Database schema
    * Authentication system (sign-up, login, validation)
    * Dashboard Prototype
    * Documentation

### 6.6. Sprint Outcome
* **Status:** Completed.
* **Summary:** The sprint objectives were successfully implemented. The platform now supports secure sign-up/login for learners and admins, database-backed authentication, preferences storage, and a prototype dashboard. This sprint establishes the baseline system architecture for upcoming sprints.