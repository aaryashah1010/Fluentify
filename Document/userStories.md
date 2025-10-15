# User Stories Categorized by Functional & Non-Functional Requirements

---

## Functional Requirements (FRs)

### FR-1: User Onboarding and Profile Management
**Technique:** Prototyping

#### USL1: Learner Registration & Profile
- **Front:** As a learner, I want to register with my details and goals, so that I can access a dashboard with a recommended learning path.  
- **Back:** Given I provide valid details and goals with proficiency level, When I submit the form, Then my profile should be created and I should be able to see my dashboard or else we have an error.

#### USL2: User Profile Management (Admin)
- **Front:** As an admin, I want to manage learner profiles, so that I can monitor user progress.  
- **Back:** Given I am authorized, When I view, search and update profiles, Then the system should show detailed progress data and allow secure changes.

#### USL3: Login & Authentication System
- **Front:** As a learner/admin, I want a secure login system, so that I can safely access the platform.  
- **Back:** Given I enter valid credentials, When I log in, Then I should be authenticated securely, or else receive an error message.

---

### FR-2: Personalized and Adaptive Learning Path
**Techniques:** Surveys & Interviews

#### USL4: Browse & Filter Languages
- **Front:** As a learner, I want to browse and filter available languages, so that I can find the perfect course for my needs.  
- **Back:** Given I am on the language library page, When I apply filters (purpose, difficulty, cultural focus), Then only the matching languages with details like duration and cultural notes are shown.

#### USL5: AI-Generated Personalized Curriculum
- **Front:** As a learner, I want the AI to suggest a personalized curriculum, so that I can learn step by step without confusion.  
- **Back:** Given that I’ve set my goals and proficiency, When the AI generates a curriculum, Then it should show the list of all modules including quizzes and daily plans without any delay.

#### USL6: Adaptive Difficulty
- **Front:** As an AI instructor, I want to adjust difficulty in real time, so that learners are challenged but not overwhelmed.  
- **Back:** Given a learner shows consistent improvement, When the AI evaluates performance, Then it should gradually increase task difficulty and adapt exercises.

---

### FR-3: Core Conversational Practice Engine
**Techniques:** Brainstorming & Surveys

#### USL7: Real-Time Chat with AI Tutor
- **Front:** As a learner, I want to make conversation with the AI Tutor, so that I can practice fluency in any language.  
- **Back:** Given that I start a live voice session, When I speak, Then the AI should respond instantly in a natural way, correcting gently, suggesting improvements, and adjusting to my level. It should also talk with me like a tutor and solve my doubts.

#### USL8: Pronunciation Feedback
- **Front:** As a learner, I want real-time pronunciation feedback, so that I can improve how I sound.  
- **Back:** Given I speak into the microphone, When the AI detects pronunciation errors, Then it should instantly highlight mistakes, provide the correct sound, and let me retry.

#### USL9: Real-Life Role-Play Scenarios
- **Front:** As a learner, I want to role-play in real-world scenarios (e.g., restaurant, airport), so that I can apply language in context.  
- **Back:** Given I select a scenario, When I practice with the AI, Then it should role-play naturally, correct mistakes, and give me level-adjusted feedback.

---

### FR-4: Learner Engagement and Skill Tracking
**Technique:** Surveys

#### USL10: Progress Report
- **Front:** As a learner, I want to receive a detailed report of my vocabulary growth and fluency scores, so that I can clearly measure my progress over time.  
- **Back:** Given I have completed practice sessions, When I request my progress report, Then I should receive a detailed report showing vocabulary growth, fluency scores, and visual progress updates over time.

#### USL11: Gamification (Points, Streaks, Badges, Leaderboards)
- **Front:** As a learner, I want gamification (points, streaks, badges, leaderboards), so that I stay motivated.  
- **Back:** Given I complete lessons or challenges, When progress is achieved, Then the system should award points, streaks, badges, and update leaderboards.

#### USL12: Peer-to-Peer Leaderboard & Weekly Contest
- **Front:** As a learner, I want to compete with peers weekly, so that I stay motivated through competition.  
- **Back:** Given I complete lessons, When scores are calculated, Then leaderboards/weekly contest rankings should update in real time.

---

### FR-5: Platform Administration and Content Management
**Technique:** Brainstorming

#### USL13: Manage Language Modules
- **Front:** As an admin, I want to add, update, or delete language modules, so that content stays fresh and relevant.  
- **Back:** Given I am authorized, When I add, edit, or delete a module, Then the system should save changes and update learners’ libraries smoothly.

#### USL14: Analytics & Monitoring
- **Front:** As an admin, I want to view analytics on learners, languages, and AI performance, so that I can understand usage trends and make better improvements.  
- **Back:** Given I open the analytics dashboard, When I review the reports, Then I should clearly see learner activity, popular languages, and AI performance.

---

### FR-6: Automated User Engagement and Reminders
**Techniques:** Analysis of Existing Systems & Surveys

#### USL15: Help Bot
- **Front:** As a learner, I want an in-chat help bot available on every screen, so that I can resolve platform issues anytime.  
- **Back:** Given I click “help” or type a query, When I ask a question, Then the help bot should respond instantly with simple solutions, FAQs, or escalate to support.

#### USL16: AI Reminders & Feedback Automation
- **Front:** As an admin, I want the AI to send motivational reminders and feedbacks so that learners stay engaged.  
- **Back:** Given reminders and automation rules are configured, When learners show inactivity, progress drops, or milestones are hit, Then the AI should send motivational messages and feedbacks.

#### USL17: Automated Emails & Motivational Messages
- **Front:** As a learner, I want to receive reminders and motivational nudges via email or text, so that I can stay consistent in my learning journey.  
- **Back:** Given inactivity or progress milestones, When the AI triggers a notification, Then I should receive an email/text reminder or motivational message.

---

## Non-Functional Requirements (NFRs)

### NFR-1: System Performance and Scalability
**Technique:** Brainstorming

#### USNFR1: System Performance (Response Time)
- **Front:** As a learner, I want fast system responses, so that my learning experience feels smooth.  
- **Back:** Given I send a request, When the system processes it, Then the response should arrive within 10 seconds for general actions and within 30 seconds to 1 minute for AI-generated replies.

#### USNFR2: Scalability
- **Front:** As an admin, I want the platform to handle many learners at once, so that performance is not affected as usage grows.  
- **Back:** Given 100+ learners use the platform concurrently, When they perform actions, Then the system should maintain consistent response times without crashing.

---

### NFR-2: Security and Privacy
**Technique:** Analysis of Existing Systems

#### USNFR3: Security & Privacy
- **Front:** As a learner, I want my personal and payment data to be secure, so that I feel safe using the platform.  
- **Back:** Given I enter sensitive data, When it is stored or transmitted, Then the system should encrypt it and restrict access only to authorized users.

---

### NFR-3: Usability and Accessibility
**Techniques:** Prototyping & Surveys

#### USNFR5: Usability
- **Front:** As a learner, I want the interface to be simple and intuitive, so that I can focus on learning instead of figuring out the platform.  
- **Back:** Given I log in as a new user, When I use any feature, Then I should be able to navigate without getting confused.

#### USNFR6: Compatibility
- **Front:** As a learner, I want the platform to work on web and mobile, so that I can learn on any device.  
- **Back:** Given I access the system from different browsers or devices, When I log in, Then the platform should work consistently across Chrome, Safari, Edge, Android, and iOS.

---

## Conflicts Between User Stories

1. **Registration/Profile (USL1) vs. Admin User Profile Management (USL2)**  
   - **Conflict:** Both create or update learner profile data.  
   - **Risk:** If schemas differ (fields in registration vs. fields editable by admin), data inconsistencies may arise.  
   - **Resolution:** Define a single profile schema early and reuse across learner and admin dashboards.

2. **AI-Generated Curriculum (USL5) vs. Adaptive Difficulty (USL6)**  
   - **Conflict:** USL5 generates a static personalized curriculum at the start, while USL6 dynamically adapts it based on learner progress.  
   - **Risk:** Learners may see conflicting or outdated recommendations.  
   - **Resolution:** Make USL5 generate a baseline curriculum and USL6 override dynamically. Ensure curriculum is a “living plan.”

3. **Real-Time Chat with AI Tutor (USL7) vs. Role-Play Scenarios (USL9)**  
   - **Conflict:** Both involve conversation with AI but differ in context (free chat vs. structured role-play).  
   - **Risk:** If both features use separate AI logic, learners may get inconsistent feedback styles.  
   - **Resolution:** Build a shared AI conversation engine that supports both free-flow (chat) and scripted (role-play) modes.

4. **Gamification (USL11) vs. Leaderboards/Contests (USL12)**  
   - **Conflict:** Both assign points and rewards, but criteria may differ.  
   - **Risk:** Learners may get confused if leaderboard scores don’t align with gamification points/streaks.  
   - **Resolution:** Unify gamification scoring rules and ensure leaderboard pulls from the same metrics.

5. **Help Bot (USL15) vs. AI Tutor (USL7)**  
   - **Conflict:** Both provide conversational support, but with different goals (learning vs. platform support).  
   - **Risk:** Learners may mix them up, e.g., asking “help” inside the tutor chat.  
   - **Resolution:** Separate channels or add a clear switch (“Ask Tutor” vs. “Ask Help Bot”).

6. **Performance (USNFR1) vs. AI Features (USL5, USL7, USL9)**  
   - **Conflict:** AI-generated responses, speech recognition, and adaptive difficulty may take more time than NFR allows.  
   - **Risk:** Exceeding the defined response time SLA (10s normal, 30–60s AI).  
   - **Resolution:** Add progress indicators/loading states and prefetch results where possible.
