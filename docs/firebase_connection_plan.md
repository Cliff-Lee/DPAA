# Firebase Connection Plan

Firebase support now lives behind the same storage interface used by local mode.

## Storage Mode

Set the provider in `js/storage/storage_mode.js`.

```js
const STORAGE_MODE = "firebase";
```

For local browser-only testing, change it to:

```js
const STORAGE_MODE = "local";
```

The MCQ engine, progress engine and teacher dashboard calculations still call `window.AAStorage`.

## Firebase Config

Paste the Firebase web app config into `window.AA_FIREBASE_CONFIG` before `js/storage/firebase_provider.js` loads, or into the `FIREBASE_CONFIG` object inside that file.

The provider uses Firebase Web modular SDK imports from `www.gstatic.com`.

## Firestore Structure

```text
classes/{classCode}
  name
  course: "AA"
  teacherUid
  createdAt
  archived

classes/{classCode}/students/{studentId}
  nickname
  courseLevel
  joinedAt
  lastSeen

classes/{classCode}/students/{studentId}/attempts/{attemptId}
  attempt data

classes/{classCode}/students/{studentId}/syllabusStats/{syllabusId}
  calculated stats
```

Student practice does not require sign-in. Students save attempts with a class code and nickname.

The teacher dashboard requires Firebase Auth sign-in when Firebase mode is active.

## Keep These Contracts

- Keep the same attempt object shape as local mode.
- Keep `js/aa_progress_engine.js` unchanged.
- Keep `js/aa_recommendations.js` unchanged.
- Keep the student MCQ page saving through `window.AAStorage.saveAttempt(...)`.
- Keep the teacher dashboard reading through `window.AAStorage.getAttempts(...)` and related interface methods.

## Security Rules To Add In Firebase

Before using real student data, configure Firestore rules for:

- unauthenticated or limited student writes to allowed class-code paths,
- teacher-only dashboard reads,
- teacher ownership or workspace membership,
- validation of the attempt object fields.
