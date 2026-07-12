# Getting Started

DP_Apps is primarily a static HTML, CSS, and JavaScript project. Most applets can run directly in the browser, while class tracking, teacher accounts, saved MCQ results, and the public demo require Firebase.

## Fastest way to explore

1. Open the [live GitHub Pages site](https://cliff-lee.github.io/DP_Apps/).
2. Browse the syllabus map or open **MCQ Practice**.
3. Use the Question Bank Builder to generate a printable test and markscheme.
4. Teacher-only features require a configured Firebase project and teacher account.

## Run locally

A local web server is recommended because browser security restrictions can interfere with modules, authentication, and cross-file navigation when pages are opened with `file://`.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Alternative Node-based server:

```bash
npx serve .
```

## Core entry pages

| File | Role |
|---|---|
| `index.html` | Main AI syllabus map and student progress entry point |
| `mcq_practice.html` | AI MCQ practice by syllabus point |
| `dp_ai_questionbank.html` | Printable test and markscheme generator |
| `teacher.html` | Teacher authentication, class management, and analytics |
| `aa_index.html` | Newer AA-facing entry page in the development version |
| `aa_mcq_practice.html` | Newer AA practice page in the development version |

The exact development structure may contain additional shared JavaScript modules, including `js/storage/firebase_provider.js`.

## Static-only use

Without Firebase, the repository still supports:

- opening applets;
- filtering the syllabus map;
- local browser progress where implemented;
- generating questions and markschemes;
- printing or saving generated papers as PDF.

## Firebase-enabled use

Firebase adds:

- email/password teacher sign-in;
- anonymous demo sign-in;
- class creation and loading;
- student nicknames and class membership;
- saved applet progress;
- MCQ attempts and syllabus statistics;
- class reports and weak-area analysis;
- scheduled deletion of public demo data.

Continue with [[Firebase Setup]] and [[Deployment]].
