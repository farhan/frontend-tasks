> Load-on-demand — not inlined into `CLAUDE.md`.

# Story Lifecycle (End-to-End Workflow)

How to take a feature or bug from idea to shipped, using the Superpowers skills.

---

## 1. Brainstorm (new feature or behaviour)

Invoke `superpowers:brainstorming` before writing any code or plan.

- Explore the problem space, alternatives, and constraints.
- Output: a clear decision + rationale.
- If the decision is significant, write a **project-scope spec** in `docs/superpowers/specs/`.

## 2. Write a spec (if design is non-trivial)

Use the template at `docs/superpowers/specs/YYYY-MM-DD-topic-design.md`.

```
YYYY-MM-DD-<topic>-design.md
plan-type: project-scope
status: active
```

Commit the spec before writing the plan. Specs are durable — never delete, only archive.

## 3. Write a task plan

Invoke `superpowers:writing-plans` to produce an execution plan.

Use the template at `docs/superpowers/plans/YYYY-MM-DD-story-slug-plan.md`.

```
YYYY-MM-DD-<story-slug>-plan.md
plan-type: task-plan
status: active
related-spec: <path to spec if one exists>
```

## 4. Execute the plan

Invoke `superpowers:executing-plans` and work through steps one at a time.

- Open only the current plan — never bulk-read `plans/`.
- Write tests first (TDD) where applicable.
- Keep commits small and focused.

## 5. Debug (if something breaks)

Invoke `superpowers:systematic-debugging`.

- Reproduce the bug before touching code.
- Identify root cause before writing a fix.

## 6. Verify before claiming done

Invoke `superpowers:verification-before-completion` before marking a story complete.

- Does it meet the acceptance criteria in the plan?
- Are there regressions?
- Does the spec still reflect reality?

## 7. Archive the plan

Set `status: archived` in the plan's frontmatter once the story ships.

Do **not** delete it — it's an audit trail.

---

## Quick reference

| Situation | Skill |
|---|---|
| New feature / behaviour | `superpowers:brainstorming` |
| Writing a plan | `superpowers:writing-plans` |
| Executing a plan | `superpowers:executing-plans` |
| Bug | `superpowers:systematic-debugging` |
| Before claiming done | `superpowers:verification-before-completion` |
