# KanbanBoard_AgenticDev

A Kanban board, built as an agentic-development exercise. This file is the
always-loaded project header — keep it small. Detailed docs live on-demand in
`docs/superpowers/`.

## Workflow

- Use the **Superpowers** skills throughout this project:
  - New feature/behavior → `superpowers:brainstorming` first, then plan + implement (TDD).
  - Bug → `superpowers:systematic-debugging`.
  - Multi-step work → `superpowers:writing-plans` → `superpowers:executing-plans`.
  - Before claiming done → `superpowers:verification-before-completion`.

## Plans & specs (two kinds, kept separate)

- **Project-scope plans** — design docs. Live in `docs/superpowers/specs/`.
  Always committed, revised, and monitored.
- **Task/story plans** — execution scaffolding for one story. Live in
  `docs/superpowers/plans/`. Committed for now; may be un-versioned later.
- Every plan file declares its kind in frontmatter (`plan-type: project-scope`
  or `task-plan`). See `docs/superpowers/agent-context-loading-policy.md` for the full model.

## Context discipline

Keep the always-loaded context small; pull heavy content on demand.

- **Never bulk-read** `docs/superpowers/plans/` — open one specific plan only
  while executing that story.
- Read a spec in `docs/superpowers/specs/` only when the task touches its design.
- Never load `node_modules/`, `dist/`, build output, lockfiles, or secrets.
- The full policy (what's always-loaded vs on-demand vs never) is documented in
  `docs/superpowers/agent-context-loading-policy.md` — itself an on-demand doc, not inlined here.
