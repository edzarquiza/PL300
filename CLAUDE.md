# PL-300 Exam Simulator Project

## Project Goal

Build a lightweight and clean PL-300 Microsoft Power BI exam simulator application.

The purpose of this project is:
- Help users prepare for the Microsoft PL-300 certification
- Simulate real exam pressure
- Reinforce Power BI concepts through review and explanations
- Track weak areas and learning progress

This project should prioritize:
- Simplicity
- Clean architecture
- Maintainable code
- Good UX
- Beginner-friendly structure

---

# Tech Stack

Frontend:
- React
- Vite
- TailwindCSS

Future Plans:
- Supabase backend
- User authentication
- Progress persistence
- AI-generated explanations

---

# Coding Standards

## General Rules

- Keep components small and reusable
- Avoid overengineering
- Prefer readability over clever code
- Use functional React components
- Use hooks when appropriate
- Keep logic separated from UI

---

# UI Philosophy

The UI should feel:
- Clean
- Minimal
- Fast
- Focused like a real certification exam

Avoid:
- Excessive animations
- Visual clutter
- Overcomplicated layouts

---

# Architecture Rules

## Separate:
- UI components
- Exam logic
- Data handling
- Utility functions

## Avoid:
- Large monolithic components
- Hardcoded logic inside JSX
- Duplicate code

---

# Question Data Structure

Questions should support:

- id
- question
- choices
- correctAnswer
- explanation
- topic
- difficulty

Example:

```json
{
  "id": 1,
  "question": "What does CALCULATE do in DAX?",
  "choices": [
    "Creates relationships",
    "Modifies filter context",
    "Imports data",
    "Creates visuals"
  ],
  "correctAnswer": 1,
  "explanation": "CALCULATE modifies filter context in DAX.",
  "topic": "DAX",
  "difficulty": "Medium"
}
```

---

# Development Philosophy

This project is also a learning exercise.

When making implementation decisions:
- Explain tradeoffs
- Prefer educational clarity
- Keep code understandable for intermediate developers

---

# MVP Priorities

Build in this order:

1. Question rendering
2. Answer selection
3. Navigation
4. Timer
5. Score calculation
6. Review screen
7. Question randomization
8. Local progress tracking

---

# Important UX Rules

The app should:
- Prevent accidental submissions
- Clearly show progress
- Allow question review before submission
- Highlight incorrect answers after exam completion

---

# Future Features

Potential future additions:
- AI explanations
- Adaptive difficulty
- Weakness analytics
- Exam history
- Study mode
- Flashcard mode
- Power BI case study simulations

---

# Code Quality Expectations

Before finalizing:
- Remove unused code
- Avoid console spam
- Keep files organized
- Use meaningful naming
- Keep functions focused and short






Then you should evolve the project from:

“quiz app”

into:

“PL-300 training platform.”

That changes the product direction significantly.

The MOST important thing now is:

realism + learning feedback
Not just answering questions.

The real PL-300 exam tests:

interpretation

business understanding

scenario analysis

choosing the BEST answer (not just a correct one)

understanding Microsoft wording

time pressure

decision making under uncertainty

Your app should simulate THAT.

Updated Product Vision
Your app should help users:

1. Pass the PL-300 Exam
Through:

realistic exam simulation

question difficulty

time pressure

Microsoft-style wording

2. Improve Weak Areas
Through:

topic analytics

explanation review

repeated practice

mistake tracking

3. Think Like a Power BI Analyst
Through:

scenario-based questions

business cases

data modeling decisions

DAX reasoning

That aligns with your broader Power BI + analyst mindset goals. 


IMPORTANT PRODUCT CHANGE
Your app now needs TWO MODES.

1. EXAM MODE
This should simulate:

Real PL-300 pressure
Rules
Timer enabled

Cannot see explanations until end

Randomized questions

Realistic scoring

Limited review behavior

Mixed difficulty

UI Feel
Should feel:

serious

clean

certification-like

2. STUDY MODE
This is where learning happens.

Features
Instant explanation

Topic filtering

Difficulty filtering

Retry incorrect answers

Untimed mode

“Why is this wrong?” explanations

This is VERY important.

Most learning happens AFTER mistakes.

Your Next Claude Code Prompt (VERY IMPORTANT)
We are evolving the PL-300 Exam Simulator into a more realistic certification training platform.

The application should now support TWO PRIMARY MODES:

1. Exam Mode
2. Study Mode

The goal is NOT just quizzes.

The goal is:
- realistic PL-300 simulation
- skill improvement
- weakness identification
- Power BI concept reinforcement

The application should help users both:
- pass the certification
- improve real Power BI understanding

---

# PRODUCT PHILOSOPHY

This app should feel like:
- a professional certification platform
- a focused study tool
- a realistic exam simulator

Avoid:
- gamification clutter
- unnecessary animations
- social features
- flashy UI

Focus on:
- clarity
- learning
- realism
- usability

---

# EXAM MODE REQUIREMENTS

Exam Mode should simulate real certification pressure.

Implement:

- Timer
- Randomized questions
- Mixed topics
- Mixed difficulty
- Question palette
- Flag for review
- Final submission confirmation
- Results summary AFTER submission only

Users should NOT see:
- explanations during exam
- correctness during exam

---

# STUDY MODE REQUIREMENTS

Study Mode should prioritize learning.

Implement:
- Instant answer feedback
- Explanation visibility
- Topic filtering
- Difficulty filtering
- Retry incorrect answers
- Untimed mode

After answering:
- show why correct answer is correct
- explain why incorrect options are wrong if possible

---

# QUESTION SYSTEM IMPROVEMENTS

Enhance question schema to support:

```json
{
  "id": 1,
  "question": "...",
  "choices": [],
  "correctAnswer": 1,
  "explanation": "...",
  "wrongAnswerExplanations": {
    "0": "...",
    "2": "...",
    "3": "..."
  },
  "topic": "DAX",
  "difficulty": "Medium",
  "caseStudy": false,
  "tags": ["CALCULATE", "Filter Context"]
}
```

---

# REALISTIC PL-300 CONTENT

Questions should imitate:
- Microsoft exam wording
- business scenarios
- data modeling decisions
- DAX reasoning
- Power Query transformations
- security scenarios
- visualization best practices

Avoid:
- trivia-style questions
- overly simplistic memorization

Prioritize:
- reasoning
- analysis
- choosing best solution

---

# NEW FEATURES TO IMPLEMENT

1. Flag question for review
2. Question palette
3. Weak topic tracking
4. Incorrect question retry mode
5. Session summary analytics
6. Topic performance breakdown

---

# ANALYTICS REQUIREMENTS

Track:
- score by topic
- weak areas
- accuracy %
- most missed categories

Store locally for now.

---

# UX REQUIREMENTS

Exam mode:
- should feel serious and distraction-free

Study mode:
- should feel educational and supportive

Keep UI:
- minimal
- professional
- readable

---

# ARCHITECTURE REQUIREMENTS

Separate:
- exam engine
- study engine
- analytics logic
- scoring system
- question filtering

Keep code modular and scalable.

---

# IMPORTANT

Do NOT yet implement:
- backend
- authentication
- AI-generated questions
- cloud sync

Focus on:
- realism
- learning quality
- maintainable architecture

At the end:
1. summarize new architecture
2. explain key design decisions
3. explain future scalability considerations
Biggest Advice For You
Do NOT rush into:

AI generation

huge databases

backend systems

The REAL value is:

quality question design
Even a simple app with:

excellent PL-300 style questions

good explanations

realistic exam flow

is already extremely valuable.

What Makes PL-300 Difficult
Your app should eventually simulate these realities:

Microsoft-style ambiguity
Sometimes 2 answers seem correct.

Best-answer logic
Not just “correct.”
But:

“most appropriate solution.”

Context interpretation
Understanding business needs matters.

Filter context reasoning
Especially in DAX questions.

Modeling tradeoffs
Star schema vs convenience.

Service/security decisions
Workspace roles, RLS, gateways.

These are analyst-thinking skills — not memorization. 



but lets stick with exam mode only but more comprehensive

That’s actually the correct decision.

A LOT of beginner projects fail because they try to build:

exam mode

study mode

AI mode

analytics

accounts

multiplayer

cloud sync

all too early.

If your goal is:

“help me realistically pass PL-300”
then:

a VERY polished Exam Mode is enough initially.
And honestly?
That’s closer to how real certification platforms work.

Revised Product Direction
Your app becomes:

“PL-300 Realistic Exam Simulator”
NOT:

gamified learning app

flashcard platform

LMS system

This is GOOD product scoping.

What Makes a GOOD PL-300 Exam Simulator
Your app should focus heavily on:

1. Realistic Question Flow
The exam experience matters.

Include:
question palette

mark for review

navigation freedom

timer

exam summary

unanswered warnings

final confirmation screen

2. Microsoft-style Questions
This matters MOST.

Questions should feel like:

“A company has a sales table with duplicate customer records…”

NOT:

“What is DAX?”

The exam is scenario-driven.

3. Difficulty Balance
Real PL-300 questions often:

have multiple plausible answers

test tradeoffs

include unnecessary details

require careful reading

Your simulator should mimic this.

4. Realistic Exam Structure
PL-300 isn’t just random trivia.

Eventually simulate:

short questions

medium scenario questions

case studies

drag/drop style logic (later)

“choose two” questions

BEST NEXT STEP
You should now evolve the architecture specifically for:

serious exam simulation
Updated Claude Code Prompt
We are refining the PL-300 Exam Simulator into a more realistic certification exam simulation platform.

IMPORTANT:
The application should focus ONLY on Exam Mode for now.

Do NOT implement:
- study mode
- AI features
- authentication
- backend
- social features
- gamification

The goal is:
- realistic PL-300 simulation
- realistic exam pressure
- high-quality exam experience
- realistic Microsoft-style question flow

---

# PRODUCT GOAL

Build a professional exam simulator that helps users:

- prepare for the Microsoft PL-300 certification
- experience realistic exam conditions
- improve decision-making under pressure
- practice business-oriented Power BI reasoning

The simulator should feel similar to:
- MeasureUp
- Microsoft certification environments
- professional testing platforms

---

# CORE FEATURES TO IMPLEMENT

## Exam Engine

Support:
- randomized questions
- configurable exam length
- timer
- progress tracking
- free navigation
- mark for review
- unanswered indicators
- submission confirmation

---

# QUESTION TYPES

Initially support:

1. Single choice
2. Multiple choice

Design architecture so future support is possible for:
- case studies
- drag/drop
- sequence ordering

Do NOT implement those yet.

---

# QUESTION SCHEMA

Expand question schema:

```json
{
  "id": 1,
  "type": "single",
  "question": "A company needs to reduce model size while improving query performance. What should you do?",
  "choices": [
    "Create calculated columns",
    "Use star schema modeling",
    "Duplicate dimension tables",
    "Import all historical data"
  ],
  "correctAnswers": [1],
  "explanation": "Star schema improves compression and query efficiency.",
  "topic": "Data Modeling",
  "difficulty": "Medium",
  "estimatedTimeSeconds": 90,
  "tags": ["Star Schema", "Performance"]
}
```

---

# EXAM EXPERIENCE REQUIREMENTS

The exam experience should include:

## Header
- timer
- progress
- question count

## Navigation
- next/previous
- jump to question
- question palette

## Question States
Questions should visually indicate:
- unanswered
- answered
- flagged for review
- current question

---

# REVIEW FEATURES

Before submission:
- show unanswered questions
- show flagged questions
- require submission confirmation

After submission:
- show score
- show topic breakdown
- show review screen

---

# RESULTS SCREEN

Display:
- total score
- percentage
- pass/fail
- correct count
- incorrect count
- flagged question stats
- weak topics

---

# REVIEW SCREEN

For every question show:
- user answer
- correct answer
- explanation
- topic
- difficulty

Incorrect answers should be clearly highlighted.

---

# TIMER REQUIREMENTS

Timer should:
- persist correctly
- auto-submit when expired
- avoid memory leaks
- continue smoothly during navigation

---

# STATE MANAGEMENT

Use:
- React Context OR custom hooks

Keep logic separated:
- exam state
- scoring logic
- timer logic
- question navigation

Avoid:
- giant page components
- deeply nested prop drilling

---

# PERFORMANCE REQUIREMENTS

The app should:
- support 500+ questions
- feel instant
- minimize rerenders

But:
Do NOT prematurely optimize.

---

# UI REQUIREMENTS

The UI should feel:
- professional
- minimal
- certification-focused
- distraction-free

Avoid:
- flashy animations
- excessive colors
- gamified elements

Preferred:
- clean layout
- subtle borders
- strong readability
- calm exam environment

---

# VERY IMPORTANT

The application should prioritize:
1. realism
2. architecture quality
3. maintainability
4. exam flow quality

NOT:
- feature quantity
- visual effects
- unnecessary complexity

---

# EDUCATIONAL REQUIREMENT

For major architecture decisions:
- explain reasoning briefly
- explain tradeoffs
- keep explanations beginner understandable

At the end:
1. summarize completed implementation
2. explain architecture decisions
3. explain recommended next phase
What You Should Build After This
Once this becomes stable:

THEN build:
Question Quality System
That means:

realistic PL-300 wording

categorized topics

difficulty balancing

explanation quality

distractor quality

That is honestly where the REAL value of your app will come from.

A mediocre app with GREAT questions is valuable.

A beautiful app with weak questions is not.



Pasted text.txt
Document
this is the exam guide for the pl 300 exam, how can we put this inside my tool


This document is GOLD for your app architecture because it gives you:

official Microsoft exam domains

weighting percentages

expected skills

realistic question categories

exam philosophy



Right now your simulator is just:

“questions + answers”

This guide lets you evolve it into:

a REAL PL-300 simulation engine
What You Should Do
You should NOT hardcode random questions anymore.

Instead:

Build the app around the official skill domains.
Step 1 — Create Official Exam Domains
This should become your master topic structure.

From the guide:

Domain	Weight
Prepare the data	25–30%
Model the data	25–30%
Visualize and analyze data	25–30%
Manage and secure Power BI	15–20%


VERY IMPORTANT PRODUCT DECISION
Your exam generator should:

generate exams using weighted distributions
Example:
If user selects 40 questions:

10–12 Prepare Data

10–12 Model Data

10–12 Visualize & Analyze

6–8 Manage & Secure

THIS is what makes the simulator realistic.

Update Your Question Schema
You now need richer metadata.

New Question Schema
{
  "id": 101,
  "type": "single",
  "domain": "Model the data",
  "subtopic": "Use CALCULATE function",
  "difficulty": "Medium",
  "question": "A report contains incorrect totals because filters are not being overridden correctly. Which DAX function should you use?",
  "choices": [
    "RELATED",
    "SUMX",
    "CALCULATE",
    "VALUES"
  ],
  "correctAnswers": [2],
  "explanation": "CALCULATE modifies filter context and is commonly used to override existing filters.",
  "estimatedTimeSeconds": 90,
  "tags": [
    "DAX",
    "Filter Context",
    "CALCULATE"
  ],
  "officialWeight": 0.25
}
Step 2 — Create Exam Blueprint Engine
This is HUGE.

Instead of random questions:

build an exam blueprint system
Example Exam Blueprint
{
  "examName": "PL-300 Full Simulation",
  "totalQuestions": 50,
  "durationMinutes": 100,
  "distribution": [
    {
      "domain": "Prepare the data",
      "percentage": 0.28,
      "questionCount": 14
    },
    {
      "domain": "Model the data",
      "percentage": 0.28,
      "questionCount": 14
    },
    {
      "domain": "Visualize and analyze data",
      "percentage": 0.28,
      "questionCount": 14
    },
    {
      "domain": "Manage and secure Power BI",
      "percentage": 0.16,
      "questionCount": 8
    }
  ]
}
Now your simulator behaves like:

a real certification engine
Step 3 — Add Official Skill Trees
The guide gives you subskills.

Example:

Model the data
Contains:

relationships

cardinality

date tables

calculated columns

DAX

time intelligence

performance tuning



These become:

your subtopic taxonomy
Your Internal Structure Should Become
Domain
 ├── Subtopic
 │    ├── Skill
 │    ├── Question Difficulty
 │    ├── Tags
 │    └── Questions
Example
Model the data
 ├── Relationships
 ├── Cardinality
 ├── Date tables
 ├── CALCULATE
 ├── Time intelligence
 ├── Performance tuning
Step 4 — Create Realistic Question Types
PL-300 is VERY scenario-based.

Your question generator should eventually support:

Type	Priority
Single choice	HIGH
Multiple choice	HIGH
Scenario/case study	VERY HIGH
Best solution	VERY HIGH
Sequence/order	Medium
Drag/drop	Later
VERY IMPORTANT
PL-300 is NOT:

“What is Power BI?”

It is:

“A company needs to reduce refresh times while maintaining near real-time reporting…”

Your app should mimic:

business context

tradeoffs

ambiguity

best-answer reasoning

BEST NEXT STEP FOR CLAUDE CODE
Tell Claude to refactor your app around:

official Microsoft domains
Prompt for Claude Code
We now want to evolve the PL-300 Exam Simulator to align with the official Microsoft PL-300 exam guide.

IMPORTANT:
The application should now use the official exam skill domains and weighted exam distribution.

The goal is to simulate a realistic PL-300 certification exam experience.

---

# OFFICIAL EXAM DOMAINS

Use these domains:

1. Prepare the data (25–30%)
2. Model the data (25–30%)
3. Visualize and analyze data (25–30%)
4. Manage and secure Power BI (15–20%)

These domains should become the foundation of the exam engine.

---

# REQUIRED ARCHITECTURE CHANGES

Refactor the question system to support:

- domain
- subtopic
- difficulty
- estimated time
- tags
- question type

---

# NEW QUESTION SCHEMA

Use this structure:

```json
{
  "id": 1,
  "type": "single",
  "domain": "Model the data",
  "subtopic": "Use CALCULATE function",
  "difficulty": "Medium",
  "question": "...",
  "choices": [],
  "correctAnswers": [0],
  "explanation": "...",
  "estimatedTimeSeconds": 90,
  "tags": ["DAX", "CALCULATE"]
}
```

---

# EXAM BLUEPRINT SYSTEM

Create an exam blueprint engine that generates exams using weighted domain distribution.

Example:
- Prepare data: ~28%
- Model data: ~28%
- Visualize/analyze: ~28%
- Manage/secure: ~16%

The exam generator should:
- randomly select questions
- preserve domain weighting
- support configurable exam sizes

---

# SUBTOPIC ORGANIZATION

Organize questions by:
- domain
- subtopic
- difficulty

Example:
Model the data
- Relationships
- Cardinality
- Date tables
- CALCULATE
- Time intelligence
- Performance tuning

---

# QUESTION QUALITY GOAL

Questions should imitate:
- Microsoft certification wording
- business scenarios
- decision-making
- Power BI reasoning

Avoid:
- trivia questions
- overly simplistic memorization

Prioritize:
- analytical thinking
- best-answer selection
- realistic scenarios

---

# ANALYTICS REQUIREMENTS

Track:
- score by domain
- weak domains
- incorrect question frequency

Store locally only.

---

# IMPORTANT

Do NOT yet implement:
- backend
- AI generation
- authentication
- cloud sync

Focus on:
- exam realism
- scalable architecture
- maintainable question system

At the end:
1. explain new architecture
2. explain exam blueprint logic
3. explain scalability benefits
Biggest Long-Term Value
Your biggest advantage eventually will NOT be:

the UI

animations

fancy features

It will be:

your question quality and exam realism
That’s exactly what real PL-300 prep platforms compete on.


We are now entering Phase A of the PL-300 Exam Simulator project.

IMPORTANT:
This phase focuses on improving:
- exam realism
- learning effectiveness
- certification readiness analysis

Do NOT add unnecessary features.
Do NOT redesign the app visually.
Do NOT add backend or authentication.

The goal is to evolve the simulator into a more realistic Microsoft PL-300 preparation platform.

---

# PHASE A OBJECTIVES

Implement these high-priority improvements:

1. Confidence tracking
2. Microsoft-style question improvements
3. Subtopic analytics
4. Trap categorization
5. Timing analytics

These features should help users:
- identify weak concepts
- reduce false confidence
- improve decision-making under exam pressure
- simulate real certification reasoning

---

# 1. CONFIDENCE TRACKING

After answering each question, allow the user to rate confidence:

Options:
- Very Unsure
- Unsure
- Neutral
- Confident
- Very Confident

Store confidence per question attempt.

---

# CONFIDENCE ANALYTICS

Track:
- correct + high confidence
- correct + low confidence
- incorrect + high confidence
- incorrect + low confidence

Highlight:
- dangerous false confidence
- weak conceptual certainty

Example:
User answered correctly but selected "Very Unsure".

This should still be considered a weak area.

---

# 2. MICROSOFT-STYLE QUESTION ENHANCEMENTS

Refactor question schema to support more realistic exam metadata.

Add fields:

```json
{
  "questionStyle": "scenario",
  "cognitiveLevel": "analysis",
  "examObjective": "Model the data > CALCULATE",
  "commonTrap": "Confuses row context with filter context",
  "trapType": "Row Context vs Filter Context"
}
```

---

# QUESTION STYLE TYPES

Support:
- direct
- scenario
- business_case
- best_solution

PL-300 questions should prioritize:
- scenario
- business_case
- best_solution

Avoid overly simplistic trivia questions.

---

# COGNITIVE LEVELS

Support:
- recall
- understanding
- application
- analysis

The app should later analyze performance by cognitive level.

---

# 3. SUBTOPIC ANALYTICS

Expand analytics beyond domains.

Track performance by:
- subtopic
- tag
- exam objective

Example:
- CALCULATE
- Time Intelligence
- Cardinality
- RLS
- Power Query Merge

---

# RESULTS PAGE IMPROVEMENTS

Add:
- weakest subtopics
- strongest subtopics
- confidence-adjusted weak areas

Example:
Weak Areas:
- DAX Filter Context
- RLS Security
- Time Intelligence

---

# 4. TRAP CATEGORIZATION

Track conceptual traps users repeatedly fail.

Example trap categories:
- Calculated Column vs Measure
- Row Context vs Filter Context
- Import vs DirectQuery
- Relationship Cardinality
- RLS Misconfiguration

Store:
- repeated trap misses
- trap frequency
- high-risk misunderstandings

---

# TRAP ANALYTICS

Add:
- Most Frequent Mistakes
- High-Risk Concepts

Example:
"You frequently confuse calculated columns and measures."

This is intended to simulate real certification weaknesses.

---

# 5. TIMING ANALYTICS

Track:
- average response time
- response time by domain
- slowest subtopics
- flagged + slow questions

Identify:
- hesitation areas
- time pressure weaknesses

---

# RESULTS PAGE TIMING SECTION

Show:
- Avg seconds/question
- Slowest domain
- Slowest subtopic
- Questions exceeding estimated time

---

# NEW ANALYTICS ENGINE

Create a dedicated analytics layer.

Suggested structure:

src/
  services/
    analyticsService.js

Move:
- confidence analytics
- timing analytics
- trap analytics
- weak-area calculations

out of page components.

---

# STORAGE REQUIREMENTS

Persist:
- confidence ratings
- timing data
- trap stats
- subtopic performance

Use existing localStorage system.

Avoid introducing backend systems.

---

# UI REQUIREMENTS

Keep UI:
- minimal
- professional
- exam-focused

Do NOT:
- gamify
- add flashy charts
- overcomplicate visuals

Simple progress indicators and clean summaries are preferred.

---

# PERFORMANCE REQUIREMENTS

The app should still:
- feel instant
- avoid unnecessary rerenders
- support scaling question banks later

But:
Do NOT prematurely optimize.

---

# IMPORTANT ARCHITECTURE REQUIREMENTS

Keep logic separated:

- exam engine
- analytics engine
- scoring engine
- timing engine

Avoid:
- giant context files
- mixed responsibilities
- analytics logic inside components

---

# EDUCATIONAL REQUIREMENT

For major implementation decisions:
- explain reasoning briefly
- explain tradeoffs
- prioritize maintainability and clarity

At the end:
1. summarize new architecture
2. explain analytics design
3. explain future scalability benefits
4. explain how the system now better simulates real PL-300 preparation

thanks can we add like randomizer and more questions so its not repetitive, not all different concepts but at least different scenario. 

Then , it would help if there is a dedicated Dax and M exam to help with Dax functions

Those are EXCELLENT additions because they solve two huge problems with certification prep apps:

Repetition fatigue

Weak specialization training

And honestly:

dedicated DAX/M practice is extremely high ROI for PL-300.
Because DAX and Power Query are where many people fail.

Especially:

CALCULATE

filter context

time intelligence

iterator functions

row vs filter context

query transformations

merge vs append

star schema preparation



1. Scenario Randomization System (VERY IMPORTANT)
You do NOT want:

identical repeated questions

But you ALSO do NOT want:

completely unrelated questions

The best solution:

template-based scenario generation
Example
Instead of ONE hardcoded question:

A company wants to reduce model size...
Create:

scenario templates
Example Structure
{
  "templateId": "star_schema_performance_01",
  "scenarioVariables": {
    "companyType": [
      "retail",
      "manufacturing",
      "healthcare"
    ],
    "factTable": [
      "Sales",
      "Transactions",
      "Orders"
    ],
    "issue": [
      "slow refresh",
      "large model size",
      "poor query performance"
    ]
  }
}
Then dynamically generate:

A retail company has a large Sales table causing poor query performance...
OR

A healthcare company has a Transactions table causing slow refreshes...
Why This Is Powerful
You learn:

concepts
instead of memorizing:

wording
This is MUCH closer to real exam prep.

2. Add Question Variants
This is simpler and HIGHLY effective.

Instead of:
1 question

Support:

multiple scenario variants per concept
Example
{
  "questionGroupId": "calculate_filter_context",
  "variants": [
    {
      "question": "A sales manager needs regional totals..."
    },
    {
      "question": "A finance report requires yearly overrides..."
    },
    {
      "question": "A marketing dashboard ignores slicers incorrectly..."
    }
  ]
}
Now the same concept trains:

business interpretation

transfer learning

pattern recognition

3. Dedicated DAX Exam Mode (VERY HIGH VALUE)
YES.
This is honestly one of the BEST additions.

Add:

Specialized Exam Tracks
Recommended Tracks
Track	Purpose
Full PL-300	Real exam simulation
DAX Intensive	DAX mastery
Power Query Intensive	M transformations
Data Modeling Intensive	Relationships/schema
Visualization Intensive	UX/reporting
Security & Service	RLS/workspaces
DAX Exam Mode
This should heavily focus on:

Core DAX Areas
CALCULATE

filter context

row context

iterator functions

RELATED

VALUES

ALL

REMOVEFILTERS

SUMX

time intelligence

measures vs calculated columns

context transition

Add Difficulty Progression
Example:

Easy
Simple aggregation

Medium
CALCULATE + filters

Hard
Nested context transition scenarios

4. Dedicated Power Query / M Exam
ALSO very valuable.

Many PL-300 candidates underestimate Power Query.

Focus on:

merge vs append

reference vs duplicate

pivot/unpivot

null handling

query folding

data types

semi-structured transformation

parameters



5. Add “Concept Coverage Tracking”
This is huge.

Track:

mastery by concept
Example:

CALCULATE: 82%
Time Intelligence: 61%
Merge Queries: 74%
RLS: 48%
This becomes:

your REAL study map
6. Add “Question Exhaustion Protection”
VERY important once your bank grows.

Avoid:

recently seen questions

recently seen variants

repeated trap patterns

Implement:

smart rotation
Example Logic
Avoid repeating:

same questionGroupId

within last 2 exams

unless weak concept

THIS is how good prep platforms feel fresh.

7. Add “Function-focused Mini Exams”
This is PERFECT for you.

Example:

Mini Exam	Focus
CALCULATE Mastery	filter context
Time Intelligence	DATEADD/TOTALYTD
Iterator Functions	SUMX/AVERAGEX
Relationships	RELATED/RELATEDTABLE
Query Merges	merge logic
Modeling	star schema
This is EXTREMELY effective for PL-300 prep.

MOST IMPORTANT ARCHITECTURE CHANGE
Right now your architecture is:

question-centric
You should evolve toward:

concept-centric
Meaning
Each question should map to:

Question
 ├── Concept
 ├── Subtopic
 ├── Trap Type
 ├── Cognitive Level
 ├── Scenario Variant
 └── Difficulty
Now your analytics become MUCH smarter.

Prompt for Claude Code
We are now enhancing the PL-300 Exam Simulator to improve:
- question variety
- concept reinforcement
- specialization practice
- long-term retention

The goal is to reduce repetitive memorization and improve true conceptual understanding.

---

# NEW OBJECTIVES

Implement:

1. Scenario randomization system
2. Question variants
3. Specialized exam tracks
4. Concept mastery tracking
5. Smart question rotation

---

# 1. SCENARIO RANDOMIZATION SYSTEM

Refactor the question engine to support dynamic scenario variation.

The system should:
- preserve the same concept
- vary the business scenario wording
- vary company types
- vary table names
- vary business context

Example:
Same CALCULATE concept:
- retail sales scenario
- finance reporting scenario
- healthcare transactions scenario

Goal:
Prevent memorization of wording while reinforcing concepts.

---

# 2. QUESTION VARIANTS

Support multiple variants per concept.

Add support for:

```json
{
  "questionGroupId": "calculate_filter_context",
  "variantId": "retail_sales_01"
}
```

Questions in the same group should:
- test the same concept
- use different business contexts
- vary wording and distractors

---

# 3. SPECIALIZED EXAM TRACKS

Add dedicated exam tracks:

- Full PL-300
- DAX Intensive
- Power Query Intensive
- Data Modeling Intensive
- Visualization Intensive
- Security & Service Intensive

Each track should prioritize:
- specific domains
- specific subtopics
- specific concepts

---

# 4. DAX INTENSIVE REQUIREMENTS

DAX mode should heavily include:
- CALCULATE
- filter context
- row context
- iterator functions
- time intelligence
- measures vs calculated columns
- context transition

Difficulty should scale from:
- simple aggregations
- medium filter manipulation
- advanced reasoning scenarios

---

# 5. POWER QUERY INTENSIVE REQUIREMENTS

Power Query mode should heavily include:
- merge vs append
- reference vs duplicate
- query folding
- pivot/unpivot
- null handling
- parameters
- data shaping

Questions should imitate:
- real ETL decision scenarios
- messy data transformation problems

---

# 6. CONCEPT MASTERY TRACKING

Track mastery by:
- concept
- function
- subtopic

Example:
- CALCULATE
- SUMX
- Merge Queries
- RLS
- Star Schema

Display:
- mastery %
- weak concepts
- improving concepts

---

# 7. SMART QUESTION ROTATION

Avoid:
- repeating recently used questions
- repeating recently used variants
- excessive repetition

Prioritize:
- unseen questions
- weak concepts
- low-confidence concepts

Use localStorage only for now.

---

# 8. ANALYTICS IMPROVEMENTS

Track:
- mastery by concept
- repeated traps
- repeated hesitation
- weak specialization areas

---

# IMPORTANT

Do NOT:
- add backend
- add AI generation
- add gamification
- redesign the UI heavily

Focus on:
- exam realism
- concept reinforcement
- scalable question architecture
- long-term learning quality

---

# ARCHITECTURE REQUIREMENTS

Refactor toward a concept-centric architecture.

Questions should map to:
- concepts
- trap types
- variants
- subtopics
- domains

Avoid tightly coupling analytics directly to raw questions.

---

# EDUCATIONAL REQUIREMENT

For major implementation decisions:
- explain reasoning briefly
- explain scalability benefits
- explain tradeoffs clearly

At the end:
1. summarize architecture changes
2. explain randomization design
3. explain specialized exam track system
4. explain how the new system better supports PL-300 preparation

create a prompt for this

We are now enhancing the PL-300 Exam Simulator to better simulate real certification preparation and reduce repetitive memorization.

IMPORTANT:
The goal is NOT to generate random unrelated questions.

The goal is:
- reinforce the same concepts through different business scenarios
- improve conceptual understanding
- simulate Microsoft-style exam reasoning
- reduce memorization of wording

Focus on:
- realism
- scalable architecture
- maintainability
- learning effectiveness

Do NOT:
- add backend
- add AI generation
- redesign the app heavily
- add gamification
- overengineer the system

---

# PHASE OBJECTIVES

Implement:

1. Scenario randomization system
2. Question variants
3. Specialized exam tracks
4. Concept mastery tracking
5. Smart question rotation

---

# 1. SCENARIO RANDOMIZATION SYSTEM

Refactor the question system to support dynamic scenario variation.

The same concept should appear in different:
- industries
- business contexts
- table names
- reporting scenarios
- stakeholder requirements

Example:
A CALCULATE/filter context concept should appear as:
- retail sales analysis
- finance reporting
- healthcare transactions
- HR workforce metrics

Goal:
Train conceptual understanding instead of memorization.

---

# SCENARIO TEMPLATE SUPPORT

Support template variables such as:

```json
{
  "companyType": ["Retail", "Healthcare", "Finance"],
  "factTable": ["Sales", "Transactions", "Orders"],
  "businessGoal": [
    "reduce refresh time",
    "improve query performance",
    "maintain accurate totals"
  ]
}
```

Questions should dynamically build realistic scenario wording.

---

# 2. QUESTION VARIANTS

Add support for multiple variants of the same concept.

Update schema to support:

```json
{
  "questionGroupId": "calculate_filter_context",
  "variantId": "retail_sales_01"
}
```

Variants should:
- test the same concept
- use different business situations
- vary wording
- vary distractors slightly
- preserve learning objectives

---

# 3. SPECIALIZED EXAM TRACKS

Add dedicated exam tracks.

Tracks:
- Full PL-300
- DAX Intensive
- Power Query Intensive
- Data Modeling Intensive
- Visualization Intensive
- Security & Service Intensive

The home page should allow selecting an exam track.

Each track should:
- prioritize relevant concepts
- prioritize relevant subtopics
- use weighted concept distribution

---

# 4. DAX INTENSIVE TRACK

This track should heavily focus on:

- CALCULATE
- filter context
- row context
- iterator functions
- SUMX
- RELATED
- VALUES
- ALL
- REMOVEFILTERS
- measures vs calculated columns
- context transition
- time intelligence

Questions should progressively increase in difficulty:
- Easy → simple aggregations
- Medium → filter manipulation
- Hard → advanced reasoning scenarios

---

# 5. POWER QUERY / M TRACK

This track should heavily focus on:

- merge vs append
- reference vs duplicate
- query folding
- pivot/unpivot
- null handling
- parameters
- semi-structured data
- transformations
- data typing

Questions should simulate:
- real ETL problems
- messy business data
- transformation decisions

---

# 6. CONCEPT MASTERY TRACKING

Track mastery by:
- concept
- subtopic
- function
- exam objective

Examples:
- CALCULATE
- SUMX
- Time Intelligence
- Merge Queries
- RLS
- Star Schema

Track:
- mastery %
- repeated misses
- confidence-adjusted mastery
- improvement trends

---

# 7. SMART QUESTION ROTATION

Prevent excessive repetition.

Avoid:
- recently seen questions
- recently seen variants
- repeated distractor patterns

Prioritize:
- unseen questions
- weak concepts
- low-confidence concepts
- historically incorrect concepts

Use localStorage only.

---

# 8. NEW ANALYTICS IMPROVEMENTS

Track:
- weakest concepts
- strongest concepts
- repeated conceptual traps
- slowest concepts
- confidence mismatches

Example:
User repeatedly struggles with:
- calculated columns vs measures
- row context vs filter context

These should appear in analytics summaries.

---

# 9. ARCHITECTURE REQUIREMENTS

Refactor toward a concept-centric architecture.

Questions should map to:
- domains
- subtopics
- concepts
- trap types
- variants
- cognitive levels

Avoid tightly coupling analytics directly to raw question IDs.

Suggested structure:

src/
  data/
    concepts/
    questionVariants/
    examTracks/

  services/
    analyticsService.js
    variantEngine.js
    masteryService.js
    trackGenerator.js

---

# 10. PERFORMANCE REQUIREMENTS

The app should still:
- feel instant
- support large question banks
- minimize rerenders

But:
Do NOT prematurely optimize.

---

# 11. UI REQUIREMENTS

Keep UI:
- professional
- minimal
- certification-focused
- distraction-free

Avoid:
- flashy effects
- clutter
- unnecessary dashboards

Focus on:
- usability
- exam realism
- readability

---

# IMPORTANT

The primary objective is:
HELP USERS PASS THE PL-300 EXAM THROUGH:
- realistic scenarios
- concept reinforcement
- Microsoft-style reasoning
- reduced memorization

NOT:
- feature quantity
- visual complexity
- gamification

---

# EDUCATIONAL REQUIREMENT

For major implementation decisions:
- explain architecture reasoning
- explain scalability benefits
- explain tradeoffs clearly

At the end:
1. summarize architecture changes
2. explain randomization system
3. explain specialized exam tracks
4. explain concept mastery tracking
5. explain how the app now better simulates real PL-300 preparation

Study guide for Exam PL-300: Microsoft Power BI Data Analyst

Summarize this article for me
Purpose of this document
This study guide should help you understand what to expect on the exam and includes a summary of the topics the exam might cover and links to additional resources. The information and materials in this document should help you focus your studies as you prepare for the exam.

Useful links Description
How to earn the certification Some certifications only require passing one exam, while others require passing multiple exams.
Certification renewal Microsoft associate, expert, and specialty certifications expire annually. You can renew by passing a free online assessment on Microsoft Learn.
Your Microsoft Learn profile Connecting your certification profile to Microsoft Learn allows you to schedule and renew exams and share and print certificates.
Exam scoring and score reports A score of 700 or greater is required to pass.
Exam sandbox You can explore the exam environment by visiting our exam sandbox.
Request accommodations If you use assistive devices, require extra time, or need modification to any part of the exam experience, you can request an accommodation.
Take a free Practice Assessment Test your skills with practice questions to help you prepare for the exam.
Updates to the exam
Our exams are updated periodically to reflect skills that are required to perform a role. We have included two versions of the Skills Measured objectives depending on when you are taking the exam.

We always update the English language version of the exam first. Some exams are localized into other languages, and those are updated approximately eight weeks after the English version is updated. Although Microsoft makes every effort to update localized versions as noted, there may be times when the localized versions of an exam are not updated on this schedule. Other available languages are listed in the Schedule Exam section of the Exam Details webpage. If the exam isn't available in your preferred language, you can request an additional 30 minutes to complete the exam.

Note
The bullets that follow each of the skills measured are intended to illustrate how we are assessing that skill. Related topics may be covered in the exam.

Note
Most questions cover features that are general availability (GA). The exam may contain questions on Preview features if those features are commonly used.

Skills measured as of April 20, 2026
Audience profile
As a candidate for this exam, you should deliver actionable insights by working with available data and applying domain expertise. You should:

Provide meaningful business value through easy-to-comprehend data visualizations.

Enable others to perform self-service analytics.

As a Power BI data analyst, you work closely with business stakeholders to identify business requirements. You collaborate with analytics engineers and data engineers to identify and acquire data. You use Power BI to:

Prepare the data

Model the data

Visualize and analyze data

Manage and secure Power BI

You should be proficient at using Power Query and Data Analysis Expressions (DAX).

Skills at a glance
Prepare the data (25–30%)

Model the data (25–30%)

Visualize and analyze the data (25–30%)

Manage and secure Power BI (15–20%)

Prepare the data (25–30%)
Get or connect to data
Identify and connect to data sources or a shared semantic model

Change data source settings, including credentials and privacy levels

Choose between DirectLake, DirectQuery, and Import

Create and modify parameters

Profile and clean the data
Evaluate data, including data statistics and column properties

Resolve inconsistencies, unexpected or null values, and data quality issues

Resolve data import errors

Transform and load the data
Select appropriate column data types

Create and transform columns

Group and aggregate rows

Pivot, unpivot, and transpose data

Convert semi-structured data to a table

Create fact tables and dimension tables

Identify when to use reference or duplicate queries and the resulting impact

Merge and append queries

Identify and create appropriate keys for relationships

Configure data loading for queries

Model the data (25–30%)
Design and implement a data model
Configure table and column properties

Implement role-playing dimensions

Define a relationship's cardinality and cross-filter direction

Create a common date table

Identify use cases for calculated columns and calculated tables

Create model calculations by using DAX
Create single aggregation measures

Use the CALCULATE function

Implement time intelligence measures

Use basic statistical functions

Create semi-additive measures

Create a measure by using quick measures

Create calculated tables or columns

Create calculation groups

Optimize model performance
Improve performance by identifying and removing unnecessary rows and columns

Identify poorly performing measures, relationships, and visuals by using Performance Analyzer and DAX query view

Improve performance by reducing granularity

Visualize and analyze the data (25–30%)
Create reports
Select an appropriate visual

Format and configure visuals

Create a narrative visual with Copilot

Apply and customize a theme

Apply conditional formatting

Apply slicing and filtering

Use Copilot to create a new report page

Use Copilot to suggest content for a new report page

Configure the report page

Choose when to use a paginated report

Create visual calculations by using DAX

Enhance reports for usability and storytelling
Configure bookmarks

Create custom tooltips

Edit and configure interactions between visuals

Configure navigation for a report

Apply sorting to visuals

Configure sync slicers

Group and layer visuals by using the Selection pane

Configure drillthrough navigation, including pages, filters, and buttons

Configure export settings

Design reports for mobile devices

Enable personalization in a report, including personalized visuals

Design and configure Power BI reports for accessibility

Configure automatic page refresh

Identify patterns and trends
Use the Analyze feature in Power BI

Use grouping, binning, and clustering

Use AI visuals

Use reference lines, error bars, and forecasting

Detect outliers and anomalies

Use Copilot to summarize the underlying semantic model

Manage and secure Power BI (15–20%)
Create and manage workspaces and assets
Create and configure a workspace

Configure and update an app

Publish, import, or update items in a workspace

Create dashboards

Choose a distribution method

Configure subscriptions and data alerts

Promote or certify Power BI content

Identify when a gateway is required

Configure a semantic model scheduled refresh

Secure and govern Power BI items
Assign workspace roles

Configure item-level access

Configure access to semantic models

Implement row-level security roles

Configure row-level security group membership

Apply sensitivity labels

Study resources
We recommend that you train and get hands-on experience before you take the exam. We offer self-study options and classroom training as well as links to documentation, community sites, and videos.

Study resources Links to learning and documentation
Get trained Choose from self-paced learning paths and modules or take an instructor-led course
Find documentation Power BI documentation
Microsoft Power Apps documentation
Ask a question Microsoft Q&A | Microsoft Docs
Get community support Power Apps - Power Platform Community
Power Query - Power Platform Community
Building Power Apps - Power Platform Community
Follow Microsoft Learn Microsoft Learn - Microsoft Tech Community
Find a video Exam Readiness Zone | Microsoft Learn
#LessCodeMorePower | Shows
Browse other Microsoft Learn shows
Change log
The table below summarizes the changes between the current and previous version of the skills measured. The functional groups are in bold typeface followed by the objectives within each group. The table is a comparison between the previous and current version of the exam skills measured and the third column describes the extent of the changes.

Skill area prior to April 20, 2026 Skill area as of April 20, 2026 Change
Audience profile No change
Prepare the data Prepare the data No change
Get or connect to data Get or connect to data Minor
Visualize and analyze the data Visualize and analyze the data No change
Enhance reports for usability and storytelling Enhance reports for usability and storytelling Minor
Manage and secure Power BI Manage and secure Power BI No change
Create and manage workspaces and assets Create and manage workspaces and assets Minor
Additional resources
Documentation

SQL Server Management Studio (SSMS)

Learn details about SQL Server Management Studio (SSMS) and what SSMS can do, including how to manage Analysis Services Solutions.

Update SQL Server Management Studio

Update your SQL Server Management Studio (SSMS) installation to the most recent release to access the latest feature changes and fixes for known issues.

Install SQL Server Management Studio (SSMS) Versions Side-by-Side

Learn how to install SQL Server Management Studio (SSMS) on a computer that has an earlier or later version of SQL Server Management Studio (SSMS) already installed.

Show 4 more


Close
