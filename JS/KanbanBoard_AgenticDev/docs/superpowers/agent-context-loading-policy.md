# Agent Context Policy

How this project manages what the AI agent loads. The goal: keep the
always-loaded header tiny (indexes, pointers) and pull heavy content on demand.



## Tier 1 — Always in context (auto-loaded every session, keep small)

Loaded whether or not it's relevant, so it must stay lean:

- `CLAUDE.md` — project instructions, conventions, context-discipline rules
- **Recalled memory index** (`MEMORY.md`) — one line per stored memory; the full
  memory files load only when a specific one is relevant
- **SessionStart hook** — the Superpowers bootstrap injected each session

## Tier 2 — Load on demand (read only when a task needs it)

Nothing here enters context automatically — an explicit `Read`/`Grep` (by the
user or the agent) pulls it in:

- `docs/superpowers/specs/*.md` — project-scope design docs
- `docs/superpowers/plans/*.md` — a task/story plan, opened only while executing
  that story (never bulk-read the folder)
- **Source files** — read as the work touches them
- **Skill bodies** — pulled in when a skill is invoked
- This file (`agent-context-loading-policy.md`)

## Tier 3 — Never loaded (kept out by ignore + a rule in CLAUDE.md)

- `node_modules/`, `dist/`, build output
- Lockfiles (`package-lock.json`, etc.) content
- Secrets — `.env*`, `.claude/.credentials.json`
- `.claude/agent-memory/`, `.claude/worktrees/`, `.claude-history/`
- Archived task plans (`status: archived`)

## How loading actually works

The harness does **not** maintain a background index or embeddings of the repo.
Only Tier 1 auto-loads. Everything in Tier 2 enters context only when the model
chooses to run a tool (`Read`, `Grep`, `Glob`, or an `Explore` subagent) or the
user asks. Subagents get their own separate context window — files they read do
not flow back into the main session.

**Enforcement:** this doc describes the policy; the short "Context discipline"
section in `CLAUDE.md` is what actually makes the agent follow it.
