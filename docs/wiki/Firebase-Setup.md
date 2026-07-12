# Firebase Setup

Firebase provides authentication, Firestore storage, and the scheduled public-demo reset.

## 1. Create or select the Firebase project

Use the existing project for the deployed site. Record the project ID and web-app configuration. The Firebase web configuration is normally included in browser code; security must come from Authentication, App Check where appropriate, and Firestore rules—not from hiding the browser configuration.

## 2. Authentication

Enable:

- **Email/Password** for teacher accounts;
- **Anonymous** for the one-click public demo.

Add authorized domains, including:

```text
localhost
cliff-lee.github.io
```

Add any custom production domain before launch.

## 3. Teacher authorization

Creating an Authentication user is not necessarily sufficient. The rules may also require a document such as:

```text
teachers/{teacherUid}
```

Use the actual teacher UID and the fields expected by the current rules. Never grant teacher privileges merely because a user knows a class code.

## 4. Firestore structure

The project uses a class-centred structure. A conceptual model is:

```text
teachers/{teacherUid}

classes/{classCode}
  name
  teacherUid
  createdAt
  demo                 // optional flag

classes/{classCode}/students/{studentUid}
  nickname
  joinedAt
  lastSeen

classes/{classCode}/students/{studentUid}/mcqAttempts/{attemptId}
  ...attempt fields

classes/{classCode}/students/{studentUid}/syllabusStats/{syllabusId}
  ...aggregate fields
```

The exact development paths must be checked against `js/storage/firebase_provider.js` and `firestore.rules` before deployment.

## 5. Firestore rules

Rules should enforce all of the following:

- authenticated teachers can access only classes they own;
- students can join only permitted classes;
- students can write only their own student/progress records;
- demo users can access only the public demo scope;
- public demo reads do not expose real classes;
- clients cannot assign themselves teacher privileges;
- sensitive configuration is not writable from the browser.

Deploy from one source of truth. If rules are edited in the Firebase Console, copy the same final text back into `firestore.rules` so a future CLI deployment does not overwrite the live correction.

## 6. Scheduled reset

The scheduled function should:

1. run daily in `Asia/Shanghai`;
2. find only demo-scoped data;
3. recursively remove nested student, attempt, and statistics records;
4. retain or recreate the `PUBLIC-DEMO` configuration as intended;
5. log counts and failures;
6. avoid touching real classes.

Scheduled Firebase functions use Cloud Scheduler and require the relevant APIs and billing configuration.

## 7. Recommended hardening

- Enable App Check after testing the basic flow.
- Add rate limits or server-side abuse controls where feasible.
- Limit anonymous writes by UID and schema.
- Reject unexpected fields in security rules.
- Use synthetic data only in the demo.
- Monitor Firestore reads/writes and function logs.
- Back up important production data separately from the demo.

Official references:

- [Anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Scheduled functions](https://firebase.google.com/docs/functions/schedule-functions)
- [Deleting Firestore data](https://firebase.google.com/docs/firestore/manage-data/delete-data)
