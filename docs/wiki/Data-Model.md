# Data Model

This page describes the logical model used by the platform. Treat it as a guide; the provider and rules files are the authoritative implementation.

## Main entities

### Teacher

Identifies an authorized teacher account.

Typical fields:

```text
uid
email or display metadata
createdAt
role/status
```

Do not rely on a browser-supplied role field to authorize teacher actions.

### Class

Represents a teacher-owned class or the shared demo class.

Typical fields:

```text
classCode
name
teacherUid
createdAt
demo
```

### Student or anonymous participant

Uses the Firebase UID as the stable document key where possible.

Typical fields:

```text
nickname
joinedAt
lastSeen
mode
```

### Applet progress

Typical fields:

```text
appletId
completed
completedAt
updatedAt
timeSpent
```

### MCQ attempt

Typical fields:

```text
questionId
syllabusId
syllabusLabel
level
selectedIndex
correctIndex
correct
timeTaken
difficulty
tags
timestamp
```

### Syllabus statistics

Derived or incrementally maintained values:

```text
attempts
correct
accuracy
totalTime
lastPractised
```

## Demo isolation

Every demo record should be identifiable through at least one trusted boundary:

- a fixed class ID such as `PUBLIC-DEMO`;
- a server-controlled demo flag;
- a path that cannot overlap normal classes.

The scheduled reset must query or traverse only this boundary.

## Derived analytics

The dashboard can derive:

- completion percentage;
- active student count;
- class average accuracy;
- weakest syllabus points;
- activity recency;
- heatmap cell status;
- recommended next practice.

For large classes, avoid repeatedly reading every raw attempt. Prefer per-student/per-syllabus aggregates and deliberate refreshes.

## Schema changes

When changing fields or paths:

1. update the provider;
2. update rules;
3. update the reset function;
4. update dashboard queries;
5. update tests or validation scripts;
6. document migration behaviour;
7. verify old clients cannot write invalid data.
