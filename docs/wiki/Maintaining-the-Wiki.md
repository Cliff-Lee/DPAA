# Maintaining the Wiki

## When to update documentation

Update the wiki whenever a change affects:

- entry pages or navigation;
- syllabus coverage;
- Firebase collections or fields;
- Firestore permissions;
- teacher/student workflows;
- demo behaviour or reset schedule;
- question-bank totals and validation;
- deployment commands;
- known limitations.

## Source priority

Use this order when resolving conflicting information:

1. deployed live behaviour;
2. current repository default branch;
3. current local development branch;
4. release notes or implementation summary;
5. older wiki text.

If local work is not deployed, label it clearly as development or pending verification.

## Suggested release workflow

1. Update code.
2. Run validation and browser tests.
3. Deploy frontend and Firebase components.
4. Verify the live site.
5. Update [[Release Notes]].
6. Update affected guide pages.
7. Commit the wiki with a specific message.

## Updating locally

After the wiki has an initial page on GitHub:

```bash
git clone https://github.com/Cliff-Lee/DP_Apps.wiki.git
cd DP_Apps.wiki
# edit Markdown files
git add .
git commit -m "Update demo deployment documentation"
git push
```

## Style

- Use direct, task-oriented headings.
- Prefer exact dates to “recently” or “yesterday.”
- Do not describe unverified deployment as live.
- Keep code paths in backticks.
- Explain both the user workflow and the security boundary.
- Include warnings where generated educational content needs human review.
