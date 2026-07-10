# Local Setup Notes

This Phase 1 app is local-only. It uses static HTML, CSS, vanilla JavaScript, MathJax, SVG diagrams and `localStorage`.

## Option 1: VS Code Live Server

1. Open this folder in VS Code.
2. Start the Live Server extension.
3. Open `aa_index.html`.

## Option 2: Python HTTP Server

From this folder, run:

```bash
python3 -m http.server
```

Then open:

```text
http://localhost:8000/aa_index.html
```

## Local Data

Student attempts are saved in this browser under:

```text
AA_LOCAL_ATTEMPTS
```

Mock class membership is saved under:

```text
AA_LOCAL_CLASSES
```

Use the reset button on the landing page or teacher dashboard to clear the local demo data.
