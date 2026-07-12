# Troubleshooting

## “Missing or insufficient permissions”

Check, in order:

1. Is the user authenticated?
2. Is the correct Firebase project loaded?
3. Is the live page using the same paths and fields as the deployed rules?
4. Does the teacher UID have the expected teacher document?
5. Is the class owned by that teacher?
6. Is the anonymous user restricted to `PUBLIC-DEMO`?
7. Were the latest rules actually published?
8. Has the browser retained an old auth state or cached JavaScript?

Use the Firestore Rules simulator for a representative read and write.

## Teacher login fails only on GitHub Pages

Add the deployed host to Firebase Authentication’s Authorized domains:

```text
cliff-lee.github.io
```

Also verify that the browser is not loading a different Firebase configuration from the local version.

## Anonymous demo sign-in fails

- Enable the Anonymous provider.
- Check browser console errors.
- Confirm the Firebase Auth domain.
- Confirm that anonymous account creation has not hit an abuse quota.
- Verify that the page calls the shared provider’s demo sign-in flow.

## Firestore rules will not compile

Recent example: a typographic apostrophe in `Today’s public demo` caused a parser failure. Replace smart punctuation with plain ASCII and republish.

Also check:

- unmatched braces;
- invalid function syntax;
- unsupported string characters;
- references to missing variables;
- differences between local and Console rule files.

## Firebase CLI authorization code is rejected

Possible causes include:

- stale local CLI credentials;
- using the short session ID instead of the displayed authorization code;
- copying the `code=` URL parameter rather than the page’s code;
- network access to Google’s token exchange endpoint being blocked.

Try:

```bash
firebase logout
firebase login --reauth
```

If the environment cannot reach the token endpoint, use the Firebase Console for the rules deployment and deploy functions later from a networked/authenticated machine.

## Demo reset removes the parent but leaves data

Deleting a Firestore document does not automatically delete its subcollections. Use recursive or explicit batched deletion for all nested demo collections.

## Scheduled reset does not run

Check:

- billing plan;
- Cloud Scheduler API;
- deployed function region and name;
- schedule/timezone configuration;
- function logs;
- permissions of the function’s service account;
- runtime dependency errors.

## Changes are in code but not on the live site

Confirm that:

- files were committed;
- changes were pushed to the correct repository and branch;
- GitHub Pages build succeeded;
- filenames and case match the links;
- the browser cache was refreshed;
- Firebase changes were deployed separately.

## Math notation is blank

Check the MathJax CDN request and browser console. A restrictive network or content blocker can prevent the library loading.

## Wide heatmap cannot be fully viewed

Place the table in a container with horizontal scrolling:

```css
.heatmap-scroll {
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}
```

Keep the first column sticky only if it does not cover data cells or break keyboard navigation.
