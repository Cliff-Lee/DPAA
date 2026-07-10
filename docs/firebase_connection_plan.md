# Firebase Connection Plan

Firebase support now lives behind the same storage interface used by local mode.

## Storage Mode

Set the provider in `js/storage/storage_manager.js`.

```js
const STORAGE_MODE = "firebase";
```

For local browser-only testing, change it to:

```js
const STORAGE_MODE = "local";
```

The MCQ engine, progress engine and teacher dashboard calculations still call `window.AAStorage`. Page scripts do not call Firestore or localStorage directly.

## Firebase Config

The Firebase web app config lives in `js/storage/firebase_config.js`.

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

The provider uses Firebase Web modular SDK imports from `www.gstatic.com`.

## Firestore Structure

```text
classes/{classCode}
  archived
  course: "AA"
  createdAt
  defaultLevel
  name
  teacherUid

classes/{classCode}/students/{studentUid}
  nickname
  courseLevel
  joinedAt
  lastSeen

classes/{classCode}/students/{studentUid}/attempts/{attemptId}
  attempt data

classes/{classCode}/students/{studentUid}/syllabusStats/{syllabusId}
  progress data
```

Student practice signs in anonymously after a student enters a valid class code and nickname. Attempts are saved under the anonymous `auth.uid`.

The teacher dashboard requires Firebase Auth email/password sign-in when Firebase mode is active. The dashboard then checks `teachers/{teacherUid}` and loads only classes where `teacherUid == auth.uid`.

## Keep These Contracts

- Keep the same attempt object shape as local mode.
- Keep `js/aa_progress_engine.js` unchanged.
- Keep `js/aa_recommendations.js` unchanged.
- Keep the student MCQ page saving through `window.AAStorage.saveAttempt(...)`.
- Keep the teacher dashboard reading through `window.AAStorage.getAttempts(...)` and related interface methods.

## Security Rules To Add In Firebase

Before using real student data, configure Firestore rules for:

- anonymous student reads of their class document and writes to their own student/attempt/stats paths,
- teacher-only dashboard reads,
- teacher ownership through `classes/{classCode}.teacherUid`,
- validation of the attempt object fields.
