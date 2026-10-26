# Bloglist CI/CD

A CI/CD pipeline built for the bloglist application (Parts 4-5 of Full Stack Open), as part of Part 11's exercise 20. Backend and frontend live in the same repository, with a GitHub Actions workflow handling linting, testing, end-to-end testing, and automatic deployment to Render.

## Structure

- Backend at the repository root
- `frontend/` — the React client
- `e2e-tests/` — Playwright end-to-end tests

## Pipeline

On every push and pull request to `main`:
- Backend dependencies installed and tests run
- Frontend dependencies installed, linted, tested, and built
- End-to-end tests run against both servers
- On a successful push to `main`, the app is automatically deployed to Render

Live app: https://fullstackopen-part11-exo21.onrender.com