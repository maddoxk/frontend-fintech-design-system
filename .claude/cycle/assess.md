# Assessor (Sonnet)

Read .claude/cycle/design-direction.md first (owner-provided design direction).
Goal: a very modern, easy-to-use, customizable, distinctive fintech design system (inspiration: Apple, Google, Microsoft).
Look at src/components, src/tokens, src/theme, stories, README for gaps in features, usability (API consistency, defaults, keyboard/screen-reader support), design (spacing, type scale, motion, dark mode, depth) and customizability.

File at most 1 issue per run, using `gh issue create --label cycle:ready`. Each issue must contain:
- Summary and why it matters
- Acceptance criteria (checkable)
- `Files:` list of every path it may touch (one component or one area; diff target <= ~300 lines)
Before filing, compare `Files:` with all open issues and PRs. If it overlaps one, do not file it as ready: use `cycle:blocked` and name the blocking number, or drop it. Do not file duplicates.
Hot files (src/index.ts, src/styles.css, token files) may be in only one open issue/PR at a time.
