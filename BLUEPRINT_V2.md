# Blueprint v2 — JavaScript-First Static Template

This repository follows a JavaScript-first static template designed for deterministic,
low-tooling workflows and robust GitHub Pages artifact deployment.

## Key Guarantees

- No Node.js required for baseline development.
- Source-of-truth content is stored in `/web`.
- Build output is deterministic and generated in `/dist`.
- GitHub Pages deploys from workflow artifacts, not committed build files.

## Structure

- `/web`: source files (HTML/CSS/JS)
- `/scripts`: local build/dev/test helpers
- `/.github/workflows`: CI + Pages workflows
- `/dist`: generated output (gitignored)
