# Guidance for AI Agents Working in This Directory

This directory contains **GSAP (GreenSock Animation Platform) skills** for AI coding agents. When editing or adding skills, follow these rules.

## Directory structure

- **Subdirectories** — Each subdirectory is one skill. The CLI and agents discover skills by scanning for subdirectories that contain `SKILL.md`.
- **Skill directory name** must exactly match the `name` in that skill’s frontmatter (e.g. `gsap-core/` ↔ `name: gsap-core`).

## SKILL.md requirements

- **Frontmatter (YAML):**
  - `name` (required): lowercase, hyphens only, max 64 chars, must match parent directory name.
  - `description` (required): what the skill does and when to use it; include trigger terms so agents know when to apply it. Max 1024 chars.
  - `license` (optional): e.g. `MIT` if the skill is under the repo license.
- **Body:** Markdown instructions. Keep under ~500 lines; put long reference material in `references/` or `scripts/` and link from SKILL.md.

## Conventions

- Write descriptions in **third person** (e.g. "Use when…" not "You can use when…").
- Be concise; avoid restating general GSAP docs. Focus on correct API usage, pitfalls, and cleanup.
- When adding a new skill: create `<skill-name>/SKILL.md`.

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [skills CLI (discovery, install)](https://github.com/vercel-labs/skills)
