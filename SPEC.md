# PL-300 Exam Simulator Specification

# Overview

A web-based exam simulator for Microsoft PL-300 certification preparation.

The simulator should mimic a real certification exam experience while also supporting learning and review.

---

# Core Features

## 1. Home Screen

### User Can:
- Start exam
- Select question count
- Select topics
- Select difficulty

### Initial Defaults:
- 20 questions
- Mixed topics
- Mixed difficulty

---

# 2. Exam Screen

## Must Include:
- Question text
- Multiple choice answers
- Current question number
- Progress indicator
- Countdown timer
- Next/Previous buttons

---

# 3. Navigation Rules

Users should:
- Navigate freely between questions
- Change answers before submission
- See answered/unanswered indicators

---

# 4. Submission Logic

When exam ends:
- Calculate score
- Show percentage
- Show pass/fail

Passing score:
- 70%

---

# 5. Results Screen

## Display:
- Final score
- Correct answers
- Incorrect answers
- Time spent
- Weak topics

---

# 6. Review Mode

For each question show:
- User answer
- Correct answer
- Explanation
- Topic
- Difficulty

---

# Question Categories

Initial categories:

- DAX
- Data Modeling
- Power Query
- Visualization
- Service & Security

---

# Difficulty Levels

- Easy
- Medium
- Hard

---

# Technical Requirements

## State Management

Use:
- React Context OR simple useState initially

Avoid:
- Redux for MVP

---

# Performance

The app should:
- Load instantly
- Handle 500+ questions smoothly

---

# Accessibility

Include:
- Keyboard navigation
- Readable fonts
- Clear contrast

---

# Local Storage

Persist:
- Last exam results
- User settings

---

# Future Expansion

Potential future additions:
- Authentication
- Cloud sync
- AI explanations
- Timed practice mode
- Case study exams
- Performance analytics
