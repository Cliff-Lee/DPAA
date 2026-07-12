# Public Demo

The newer development version introduces a **Try the Live Demo** button so visitors can explore the product without a shared email/password.

## Intended experience

When a visitor starts the demo:

1. Firebase signs the visitor in anonymously.
2. The app generates a guest nickname.
3. The visitor joins the shared `PUBLIC-DEMO` class.
4. The visitor can view, refresh, and contribute public activity.
5. Teacher-only and premium-only controls remain hidden.
6. A banner explains that activity is shared and scheduled for daily deletion.

## Why a shared demo

A shared public class makes the product feel active and allows visitors to see the kind of class analytics a premium teacher account can provide. It also avoids publishing a reusable teacher password.

## Privacy message

Use wording similar to:

> **Shared public demo.** Activity can be seen by other visitors and is deleted during the daily reset. Do not enter personal or confidential information.

Avoid promising deletion at a specific time until the scheduled function has been deployed and observed successfully.

## Access boundaries

Demo users may:

- read public demo activity;
- create or update only the records assigned to their anonymous UID;
- answer questions and record demo progress.

Demo users must not:

- access real classes;
- read teacher profiles;
- create classes;
- invoke manual reset controls;
- change account credentials;
- write data on behalf of another anonymous user.

## Nightly reset

The implementation is designed to recursively clear nested demo data at midnight in the `Asia/Shanghai` timezone while preserving the demo configuration and allowing new visitors to repopulate it.

Firestore does not automatically remove nested subcollections when a parent document is deleted. The reset therefore needs server-side recursive or explicitly batched deletion of students, attempts, statistics, and related demo records.

## Deployment requirements

- Anonymous sign-in enabled in Firebase Authentication
- Firestore rules deployed
- `PUBLIC-DEMO` class/configuration present
- Cloud Functions deployed
- Cloud Scheduler API enabled
- Billing-enabled Firebase project for scheduled functions
- Live end-to-end verification

## Current status

The recent development work implemented the demo flow and changed files including:

- `aa_index.html`
- `aa_mcq_practice.html`
- `js/storage/firebase_provider.js`
- `firestore.rules`
- `functions/index.js`
- `public_demo_setup.md`

The last reported deployment attempt reached the Firestore Rules editor and found a parser issue caused by a typographic apostrophe in an internal demo name. That text was changed to plain ASCII in three local files. The final rules publication and scheduled-function deployment were **not confirmed** in the supplied update.

Do not label the demo as fully live until the checks in [[Deployment]] pass.
