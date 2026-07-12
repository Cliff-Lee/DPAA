# Security and Privacy

## Principles

- Store the minimum student information needed.
- Prefer nicknames or school-approved identifiers.
- Keep real classes private to their teacher and members.
- Treat the shared demo as public and temporary.
- Enforce permissions in Firestore rules, not only in the UI.
- Never store passwords in Firestore or source code.

## Firebase web configuration

A Firebase browser configuration contains project identifiers and an API key intended for client initialization. It is not a substitute for authorization. Protection comes from correctly configured APIs, Authentication, App Check where used, quotas, and Firestore rules.

## Public demo risks

Because visitors share one public activity space:

- they can see demo activity created by others;
- offensive or misleading nicknames could appear;
- automated clients could create excessive records;
- deletion may fail if the scheduled function is not running;
- anonymous Authentication accounts can accumulate separately from Firestore records.

Mitigations include:

- generated nicknames rather than free text;
- schema validation in rules;
- per-UID write restrictions;
- quotas and monitoring;
- a prominent public-data notice;
- nightly cleanup logs;
- App Check after initial validation.

## Teacher and class data

A teacher should be able to access only classes they own. A student should not gain teacher access through a class code, editable role field, URL parameter, or local-storage value.

## Exports

CSV exports may contain student-level educational records. Treat downloaded files as sensitive school data and follow applicable school policy and local law.

## Incident response

If unexpected public access is discovered:

1. disable the affected UI route if necessary;
2. tighten and deploy Firestore rules;
3. inspect Authentication and Firestore logs;
4. remove exposed demo or test data;
5. rotate genuine server credentials if any were exposed;
6. verify that no service-account key is committed;
7. document the cause and add a regression test.
