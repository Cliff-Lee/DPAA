# Shared Public Demo

The teacher dashboard now offers a one-click **Try the demo** entry. It signs
the visitor in anonymously and loads the shared `PUBLIC-DEMO` class. Visitors
can follow the student-practice link to add activity with a generated nickname.

All demo nicknames and practice activity are intentionally visible to every
signed-in visitor. Premium teacher accounts continue to use the email and
password form and retain private class ownership.

## Firebase launch checklist

1. Enable **Anonymous** authentication in Firebase Authentication. The student
   practice flow already depends on this provider.
2. Deploy `firestore.rules`. The rules allow signed-in visitors to read the
   public demo while limiting each visitor's writes to their own anonymous uid.
3. Install the dependencies in `functions/` and deploy `resetPublicDemo`.
4. Confirm that the Firebase project uses the Blaze plan and that Cloud
   Scheduler is enabled. Scheduled functions require billing.
5. Open the dashboard, select **Try the demo**, add a student attempt, and
   confirm that it appears after refreshing the demo dashboard.

The scheduled function recursively deletes `classes/PUBLIC-DEMO` and all of
its student, attempt and syllabus-stat subcollections at `00:00` in the
`Asia/Shanghai` timezone, then recreates the empty public class document.

Deploy the backend pieces from the project root:

```sh
firebase deploy --only firestore:rules,functions
```
