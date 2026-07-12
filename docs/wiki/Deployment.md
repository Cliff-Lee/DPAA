# Deployment

DP_Apps has separate frontend and Firebase deployment steps.

## A. Deploy the static site to GitHub Pages

1. Commit the intended HTML, CSS, JavaScript, and asset changes.
2. Push to the branch configured for GitHub Pages.
3. Open the repository’s **Settings → Pages** and confirm the source branch/folder.
4. Wait for the Pages workflow to complete.
5. Hard-refresh the live site and test all key entry pages.

Recommended checks:

```text
/
/teacher.html
/mcq_practice.html
/dp_ai_questionbank.html
/aa_index.html              (development version)
/aa_mcq_practice.html       (development version)
```

## B. Deploy Firestore rules

From an authenticated Firebase CLI session:

```bash
firebase use <project-id>
firebase deploy --only firestore:rules
```

Or publish through the Firebase Console’s Firestore Rules editor.

After a Console edit, copy the identical rules back into the repository. Otherwise a later CLI deployment may overwrite the live rules.

### Rules parser warning

Use plain ASCII in rule source, identifiers, and internal strings. A recent deployment was blocked by a typographic apostrophe in the phrase `Today's public demo`; the development files were changed to use an ASCII apostrophe.

## C. Deploy Cloud Functions

Install dependencies from the functions directory, then deploy:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

Scheduled functions require Cloud Scheduler and an appropriate billing-enabled Firebase plan.

## D. Verify the public demo

Do not consider the demo launched until all tests pass:

- [ ] Anonymous provider enabled
- [ ] `PUBLIC-DEMO` configuration exists
- [ ] “Try the Live Demo” signs in without a password
- [ ] Generated guest nickname appears
- [ ] Demo user can read permitted public activity
- [ ] Demo user can write only their own activity
- [ ] Demo user cannot open real classes
- [ ] Teacher/class creation controls are absent in demo mode
- [ ] Teacher sign-in still works
- [ ] Scheduled function is visible in Firebase/Google Cloud
- [ ] Manual test run deletes nested demo data only
- [ ] Next scheduled run completes successfully
- [ ] Reset logs record success/failure clearly

## E. Verify cross-version compatibility

Because the public repository may lag behind the local development version, compare:

- frontend path names;
- Firestore collection paths;
- field names;
- rule predicates;
- function reset paths;
- Firebase project configuration.

A mismatch commonly appears as a permissions error even when each individual file looks correct.

## F. Publish this wiki

Create an initial Home page from the GitHub **Wiki** tab, then clone the wiki repository:

```bash
git clone https://github.com/Cliff-Lee/DP_Apps.wiki.git
cp -R DP_Apps_GitHub_Wiki/* DP_Apps.wiki/
cd DP_Apps.wiki
git add .
git commit -m "Add project wiki"
git push
```

GitHub only renders changes pushed to the wiki repository’s default branch.
