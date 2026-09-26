# Task/story plans

**Execution scaffolding** — the "how to build one specific thing" plans.
Produced by `superpowers:writing-plans`. Committed for now (useful audit trail),
but may be un-versioned later — see the commented toggle in the project
`.gitignore`. Often disposable once the story ships.

> Do **not** bulk-read this folder. Open one specific plan only while executing
> that story (see `../context-policy.md`).

## Naming

```
YYYY-MM-DD-<story-slug>-plan.md
```

## Frontmatter template

```yaml
---
plan-type: task-plan
status: active            # active | archived
related-spec: docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md
---
```

`related-spec` links back to the project-scope design this plan implements.
Set `status: archived` once the story is done.
