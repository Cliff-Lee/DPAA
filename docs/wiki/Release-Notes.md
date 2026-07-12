# Release Notes

## 12 July 2026 — Audit-led question-bank expansion

- Increased complete stored questions to 1,341: 843 exam questions and 498 MCQs.
- Increased genuinely distinct templates from 166 to 179.
- Validated 19 parameterised generator families.
- Added 13 mixed-topic exam families containing 65 parts and 207 marks.
- Normalised 830 legacy markschemes to more detailed IB-style guidance.
- Expanded metadata for 1,328 legacy questions.
- Tested 9,500 randomized generator outputs.
- Reported zero validation errors and zero warnings.
- Reduced sampled generator failures from 720 to zero.
- Added mixed-topic, question-style, difficulty-4, and diagram/data filters.
- Added responsive table, Argand, and open-box renderers.
- Fixed mobile horizontal overflow found during browser testing.

## 10 July 2026 — Shared live-demo implementation

- Added one-click anonymous access to the shared `PUBLIC-DEMO` class.
- Added generated guest nicknames and shared-data/reset messaging.
- Allowed visitors to view, refresh, and contribute public demo activity.
- Kept premium sign-in available.
- Hid class creation and reset controls in demo mode.
- Added Firestore rule changes restricting writes to each anonymous visitor’s own account.
- Added a scheduled recursive reset intended for midnight Shanghai time.
- Added `public_demo_setup.md` with deployment steps.
- Updated AA pages and shared Firebase provider files.

### Deployment note

The Firebase CLI login could not complete in the working environment because the token-exchange endpoint was unreachable. A Console-based rules deployment was attempted. A smart-apostrophe parser issue was identified and corrected locally, but final publication and scheduled-function deployment were not confirmed in the supplied update.

## Public GitHub Pages baseline

The current public repository snapshot exposes:

- the 36-applet AI syllabus map;
- MCQ practice;
- the Question Bank Builder;
- the teacher dashboard;
- 36 individual interactive applet files.

The public snapshot may lag behind the local development version described above.
