# PL-300 Exam Simulator — Specification

## Overview

A web-based exam simulator and reasoning trainer for Microsoft PL-300 (Power BI Data Analyst) certification preparation.

The simulator mimics real certification exam pressure (timer, palette, flagging, scoring against the official exam blueprint) while also providing dedicated reference and review tools (concept reviewer, DAX function library, walkthroughs, terminology glossary) for deeper learning.

Tech stack: React + Vite + TailwindCSS, React Router v6, localStorage persistence (no backend).

---

# Implemented Features

## 1. Exam Engine (`/exam`, `/results`)

- **460 questions** across the 4 official PL-300 domains, weighted to match the real exam blueprint (~28/28/28/16%)
- **Multiple question types**, dispatched by `QuestionRenderer` (`src/components/question-types/`):
  - `single` — single choice (449)
  - `multi` — select all that apply / multiple choice (3)
  - `drag_drop` — match prompts to draggable answer choices (4)
  - `rearrange_steps` — drag/reorder steps into the correct sequence (4)
  - `true_false` and `multi_part` types are supported by the renderer and scoring layer but have no question content yet
- Shared scoring/answer-state logic lives in `src/utils/answerUtils.js` (`isAnswerEmpty`, `isAnswerCorrect`) — the single source of truth used by ExamContext, examUtils, QuestionPalette, StudyFeedback, ReviewCard, HistoryPage, and psychologyAnalyticsService
- **6 specialized exam tracks** (`src/data/examTracks.js`):
  - Full PL-300 — official weighted simulation
  - DAX Intensive — CALCULATE, filter context, iterators, time intelligence
  - Power Query — merge/append, query folding, M language, transforms
  - Data Modeling — relationships, schema design, cardinality
  - Visualization — visuals, formatting, navigation, AI analytics
  - Security & Service — RLS, workspaces, licensing, gateways
- Configurable question count per track, mixed difficulty (Easy/Medium/Hard)
- Timer with auto-submit on expiry
- Question palette showing answered / unanswered / flagged / current state
- Flag for review, free navigation (next/previous/jump)
- Confidence rating per question (Very Unsure → Very Confident)
- Unanswered/flagged warnings + submission confirmation before scoring
- **Case studies** (7) — multi-question scenarios sharing a business background, requirements, and dataset description
- **Variant engine** — scenario randomization so the same underlying concept appears with different business wording/industries across attempts
- **Anti-repetition engine** + **retry queue** — avoids recently-seen questions/variants and prioritizes weak or previously-incorrect concepts

## 2. Results & History (`/results`, `/history`)

- Score, percentage, pass/fail (70% threshold), correct/incorrect counts
- Domain-by-domain performance breakdown
- Flagged-question stats and timing analytics (slowest domain/subtopic, questions over estimated time)
- Full review screen per question: user answer vs. correct answer, explanation, topic, difficulty
- Exam history log with retake-exact-exam option
- **Readiness Widget** — overall PL-300 readiness % with strong areas and risk areas

## 3. Analytics Engine (services layer)

Dedicated, UI-independent services in `src/services/`:

- `analyticsService` — score/topic/accuracy aggregation
- `masteryService` — concept-level mastery tracking and trends
- `conceptCoverageService` / `conceptExposureService` — tracks which concepts/questions a user has seen
- `psychologyAnalyticsService` — confidence-vs-correctness mismatch detection (false confidence, low-confidence-but-correct)
- `readinessService` — combines mastery, confidence accuracy, trap frequency, and domain balance into a readiness estimate
- `historyService` — exam attempt history persistence
- `examBlueprint` / `examGenerator` — weighted question selection per track
- `variantEngine` — scenario randomization
- `antiRepetitionEngine` / `retryQueueService` — rotation and retry logic
- `terminologyProgressService` — weak-term and view-count tracking

All persistence is localStorage-based.

## 4. Concept Reviewer (`/reviewer`)

- ~105 concept cards across 7 categories:
  - Foundational (18), DAX (18), Modeling (16), Power Query (16), Security (14), Visualization (8), Common Traps (15)
- Each card includes: summary, visual diagram, key insight, common trap, and a mini-quiz
- Integrated with weak-area tracking pulled from exam history

## 5. DAX Function Library (`/dax`)

- 28 DAX functions covered (CALCULATE, SUMX/AVERAGEX, RANKX, USERELATIONSHIP, DIVIDE, SWITCH, EARLIER, VALUES/SELECTEDVALUE, time-intelligence functions, etc.)
- Each function page includes: syntax, parameter explanations, sample data, expected output, exam traps, and visual walkthroughs via `DaxFunctionDetail`, `DaxIteratorViz`, `DaxFilterFlow`, `DaxParameterTable`

## 6. Interactive Walkthroughs (`/walkthroughs`)

- 17 step-by-step walkthroughs (CALCULATE, FILTER, SUMX, star schema, cardinality, dynamic RLS, merge/append, role-playing dimensions, filter propagation, etc.)
- Visual relationship diagrams and transformation previews showing starting state → transformation → reasoning → result

## 7. Terminology & Acronym Reviewer (`/terminology`)

- 44 terms across 6 categories: Power BI Fundamentals, DAX, Data Modeling, Power Query, Security, Microsoft Fabric
- Each term card: acronym/term, full meaning, simple explanation, why it matters, real-world example, exam tip, related terms, PL-300 relevance
- Browse mode (search + category/weak filters, accordion cards) and Flashcard mode (reveal/prev/next, mark weak/known)
- Weak-term tracking and per-term view counts via `terminologyProgressService`

---

# Architecture

```
src/
  data/            static content (questions, case studies, exam tracks, reviewers, dax functions, walkthroughs, terminology)
  services/        engines (exam blueprint/generator, analytics, mastery, readiness, anti-repetition, terminology progress)
  context/         ExamContext — exam state, timer, navigation
  pages/           route components (8 routes)
  components/      reusable UI (question-types/, charts/, walkthrough/, ConceptCard, QuestionCard, etc.)
```

Routes: `/`, `/exam`, `/results`, `/history`, `/reviewer`, `/dax`, `/walkthroughs`, `/terminology`

Separation of concerns:
- UI components contain no exam/scoring/analytics logic
- Exam engine, analytics engine, scoring, and timing logic live in `services/`
- Question/content data is static JSON/JS in `data/`, decoupled from analytics

---

# Technical Requirements

## State Management
- React Context (`ExamContext`) for exam session state
- Local component state (`useState`/`useMemo`) for page-level UI state
- No Redux

## Performance
- App loads instantly, handles 500+ questions smoothly
- Pages are lazy-loaded via `React.lazy` + `Suspense`
- No premature optimization

## Accessibility
- Keyboard navigation
- Readable fonts and clear contrast
- Minimal, distraction-free, certification-style UI (no gamification, no flashy animations)

## Local Storage
Persisted locally:
- Exam results and history
- Confidence ratings, timing data, trap stats
- Concept/subtopic mastery and exposure data
- Terminology weak terms and view counts
- User exam settings (track, question count)

---

# Future Expansion

Potential future additions (not yet implemented):
- Backend (Supabase) + authentication + cloud sync
- AI-generated explanations / questions
- Adaptive difficulty
- `true_false` and `multi_part` question content (renderer/scoring already support both types)
- Expanded drag-and-drop / sequence-ordering question coverage beyond the initial 8
- Expanded case study library
- Additional DAX function coverage (target 25–30+: HASONEVALUE, ISFILTERED, CALCULATETABLE already added — continue expanding)

---

# Maintenance Note

**This file should be updated whenever a new feature, page, route, or major service is added**, so it stays an accurate map of the application's current capabilities.
