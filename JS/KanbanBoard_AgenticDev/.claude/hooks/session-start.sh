#!/usr/bin/env bash
# SessionStart bootstrap — output is injected into context at the start of every session.
# Keep this short: it is always loaded. Use it to surface critical reminders only.

cat <<'BOOT'
## Session bootstrap

- Follow the workflow rules in CLAUDE.md.
- Use Superpowers skills: brainstorming → writing-plans → executing-plans → verification-before-completion.
- Never bulk-read docs/superpowers/plans/ — open one specific plan at a time.
- Check MEMORY.md for relevant stored context before starting work.
BOOT
