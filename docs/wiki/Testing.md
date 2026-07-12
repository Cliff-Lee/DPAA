# Testing

## Static page checks

- Every navigation link resolves.
- Clicking the applet image/card and the text button opens the same resource.
- Filters return the expected applets.
- No page introduces horizontal body overflow on mobile.
- Mathematical notation renders.
- Print output excludes unnecessary controls.

## Authentication checks

Test as:

- signed-out visitor;
- anonymous demo visitor;
- valid teacher;
- authenticated non-teacher;
- student in a real class;
- user attempting another student’s path.

## Firestore rules matrix

| Actor | Demo read | Own demo write | Real class read | Create class | Teacher records |
|---|---:|---:|---:|---:|---:|
| Signed out | As designed, usually no | No | No | No | No |
| Anonymous demo | Yes | Yes | No | No | No |
| Real student | No unless explicitly public | No | Own permitted class scope | No | No |
| Teacher | Optional | Optional | Owned classes | Yes | Own permitted record |
| Other authenticated user | No | No | No | No | No |

Adapt the matrix to the final rules, then test every allow/deny boundary.

## Demo reset test

Seed the demo with:

- multiple student documents;
- applet progress;
- MCQ attempts;
- syllabus statistics;
- nested subcollections.

Run the reset manually and verify:

- all intended demo data is gone;
- the demo can be joined again;
- the demo configuration is retained/recreated;
- no real class changed;
- logs contain counts and any failures.

## Generator validation

The recent development audit sampled 9,500 randomized outputs and reported zero validation errors/warnings after generator failures were reduced from 720 to zero. Keep automated randomized testing as a release gate.

Useful checks include:

- unique answer options;
- finite numeric values;
- valid domains;
- correct units;
- consistent marks;
- answer/markscheme agreement;
- valid SVG;
- non-empty metadata;
- correct paper/level eligibility.
