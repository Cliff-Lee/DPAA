# MCQ Practice

The MCQ practice page creates dynamic questions from selected IB AI syllabus points and records results when the learner has joined a Firebase-backed class or demo workspace.

## Learner controls

- **Level:** AI SL or AI HL
- **Number of questions:** 5, 10, 15, 20, 30, 50, or 100
- **Difficulty:** mixed, standard, exam challenge, or hard only
- **Syllabus selection:** individual points, visible points, clear, or weak areas

## Question styles

The expanded system includes:

- direct calculation;
- contextual application;
- graph, table, or diagram interpretation;
- reverse engineering;
- parameter changes;
- multi-step reasoning;
- critique and error diagnosis;
- misconception-based distractors;
- challenge questions.

## Saved attempt data

A typical MCQ attempt stores fields such as:

```text
timestamp
syllabusId
syllabusLabel
level
questionId
correct
selectedIndex
correctIndex
timeTaken
difficulty
tags
```

A per-syllabus summary can aggregate:

```text
attempts
correct
totalTime
lastPractised
```

Confirm the exact collection paths against `js/storage/firebase_provider.js` before changing rules or writing migrations.

## Feedback design

Good feedback should:

1. state whether the answer is correct;
2. show the essential method;
3. explain why a tempting distractor is wrong;
4. identify the misconception where possible;
5. recommend a next action or related applet.

## Quality assurance

Before adding a generator family:

- test many randomized outputs;
- reject duplicate options;
- check that the correct answer is unique;
- validate notation and units;
- verify all parameter ranges;
- test diagrams at mobile widths;
- ensure feedback matches the generated values.
