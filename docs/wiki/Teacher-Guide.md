# Teacher Guide

## Sign in

Open `teacher.html` and sign in with the email/password account configured in Firebase Authentication. The teacher UID must also have the expected teacher record or authorization used by the Firestore rules.

If login works locally but fails on GitHub Pages, add the GitHub Pages host to Firebase Authentication’s **Authorized domains** list.

## Create a class

1. Enter a class name.
2. Choose or generate a class code.
3. Create the class.
4. Give students the class code.
5. Ask students to use an appropriate nickname.

Class codes should be easy to type but difficult to guess accidentally. Avoid exposing private class data in a public screenshot.

## Load and review progress

The dashboard can show:

- number of students;
- average applet completion;
- total completed applets;
- last active time;
- progress by applet;
- MCQ attempts and accuracy;
- weakest visible syllabus point;
- class weak areas;
- individual student summaries.

Use the search, topic, and level filters to narrow the report.

## Student-by-syllabus heatmap

The development dashboard includes a wide syllabus heatmap. It should be placed inside a horizontally scrollable container so every syllabus column remains reachable on smaller screens.

Recommended behaviour:

- sticky student-name column;
- horizontal scrolling within the report area;
- visible scroll affordance;
- keyboard-accessible scrolling;
- responsive cell sizing;
- CSV export of the underlying table.

## Exporting data

Use **Export CSV** for offline analysis, reports, or backup. Before sharing an export:

- remove names or identifying nicknames when not needed;
- confirm the file contains only the intended class;
- store it according to school policy;
- delete local copies when they are no longer required.

## Using the Question Bank Builder

Select syllabus points, paper style, level, question count, and difficulty. Generate both the question paper and markscheme, then review them before printing.

See [[Question Bank]].

## Public demo versus teacher mode

Demo visitors must not receive:

- class creation controls;
- teacher-only class lists;
- manual reset controls;
- access to real teacher records;
- access to non-demo classes.

The interface should visibly label demo mode and explain that activity is shared and temporary.
