# AGENTS.md

## Repository expectations

This is a TypeScript-first codebase. Prefer small, reviewable changes over broad rewrites.

## Commands

Before proposing completion, run the most relevant checks:

- Type check
- Lint
- Unit tests
- Relevant integration tests when auth, routing, API, or security behavior changes

Use the package manager already present in the repository. Do not switch package managers.

## Engineering standards

- Prefer explicit types at API and package boundaries.
- Validate external input at the boundary.
- Do not trust client-side state for authorization.
- Avoid unsafe redirects. Redirect targets must be relative paths or explicitly allowlisted.
- Do not expose tokens, secrets, refresh tokens, or tenant-sensitive data to logs or browser-visible state.
- Prefer server-side authorization checks over UI-only guards.
- Add or update tests for security-sensitive behavior.

## Review expectations

When reviewing code, prioritize:

1. Security/auth/tenant isolation
2. Runtime correctness
3. Accessibility
4. Maintainability
5. Style only when it affects clarity or safety

Challenge unnecessary abstractions.
