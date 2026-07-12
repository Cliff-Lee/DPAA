# Uploading this wiki bundle

This folder is ready to use as the content of the GitHub wiki repository for:

```text
https://github.com/Cliff-Lee/DP_Apps
```

## First-time setup

1. Open the repository on GitHub.
2. Open the **Wiki** tab.
3. Create and save an initial page named `Home`.
4. Clone the wiki repository:

```bash
git clone https://github.com/Cliff-Lee/DP_Apps.wiki.git
```

5. Copy the Markdown files from this bundle into the cloned folder.
6. Commit and push:

```bash
cd DP_Apps.wiki
git add .
git commit -m "Create DP_Apps project wiki"
git push
```

GitHub will use `Home.md`, `_Sidebar.md`, and `_Footer.md` automatically.

## Before publishing externally

Review these pages against the latest local code:

- `Public-Demo.md`
- `Firebase-Setup.md`
- `Data-Model.md`
- `Deployment.md`
- `Release-Notes.md`

The bundle intentionally states that final Firebase demo deployment was not confirmed in the supplied update.
