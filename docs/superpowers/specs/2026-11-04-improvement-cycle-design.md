# Improvement Cycle — Design

Date: 2026-11-04
Repo: maddoxk/frontend-fintech-design-system (default branch `main`)

## Intent

Make this design system steadily better with no human in the loop once a beat begins. The target: a very modern look (inspiration: Apple, Google, Microsoft), easy to use, customizable, and distinctive. The cycle finds gaps in features, usability and design, files them as GitHub issues, implements each on its own branch, reviews the PR, and merges it or sends it back. Then it repeats.

The owner's main worry is **flow breaking down**: merge conflicts, vague issue/PR scope, items hanging between agents, backlogs of issues without PRs or PRs without reviews. The design is built around preventing those. Limited tokens are the second constraint.

## Goals

- Fully hands-off: reviewed PRs merge automatically; no approval step.
- Never work on `main`. One feature branch per issue (`issue-<n>-<slug>`), one worktree per active agent.
- No merge conflicts reaching `main`; no item stuck without an owner or a timeout.
- Bounded backlog at every stage (caps below).
- Token-frugal: cheap models for mechanical steps, strong model only for review.

## Non-goals / anti-goals

- Not a release or publishing pipeline (no npm publish, no version bumps).
- Must not rewrite the library in one giant PR. A cycle that "works" by producing sprawling PRs is a failure.
- Must not merge on a red or missing CI check, or force-push `main`.
- Must not loop forever on one PR or burn budget when there is no work.

## The pipeline

State lives in GitHub labels (the source of truth), so any beat can resume after a crash.

Issue labels: `cycle:ready` → `cycle:claimed` → (PR opened) → closed by merge. Escape hatch: `cycle:needs-human`.
PR labels: `cycle:in-review` → `cycle:changes-requested` → `cycle:in-review` … → merged. Escape hatch: `cycle:needs-human` (closed).

Stages:

1. **Assess** — inspect the repo (components, tokens, theme, stories, README, a11y, API ergonomics) against the goals. File issues.
2. **Implement** — claim a `cycle:ready` issue, branch from latest `main`, build it with tests/stories, open a PR containing `Closes #<n>`.
3. **Review** — review the PR diff only. Pass or fail.
4. **Fix** — on fail, a fixer pushes to the same branch; back to Review.
5. **Merge + cleanup** — on pass and green gates, rebase, squash-merge, delete branch and worktree, close issue, append to cycle log.

## Scope and conflict rules (the core safeguard)

- Every issue declares: **summary, acceptance criteria, and a `Files:` list** of paths it may touch. One component or one area per issue; target a small diff (guideline: ≤ ~300 changed lines).
- **Overlap check before filing and before claiming:** an issue whose `Files:` overlaps any open issue/PR in `cycle:claimed`/`in-review` is not filed as ready; it is held (`cycle:blocked-by-#n`) or folded into the existing issue.
- Shared hot files (`src/index.ts`, `src/styles.css`, token files) are touched by at most one in-flight PR at a time.
- Implementers may not touch files outside the issue's `Files:` list. The reviewer fails the PR if the diff does.
- Before merge the PR branch is rebased on current `main`; if the rebase conflicts, a conflict-fixer handles it once, otherwise the PR goes to `needs-human`.
- Merges are serialized: one merge at a time.

## Flow control (backlog and hanging items)

- **Caps:** at most 3 issues `cycle:ready`+`claimed` combined, and at most 3 open cycle PRs. Assess files nothing when at cap. Implement starts nothing while ≥ 2 PRs await review/fix.
- **Priority per beat:** sweep → merge/review waiting PRs → fix → implement → assess. Downstream work always beats upstream work.
- **Timeouts (sweep):** a `claimed` issue with no PR after 60 min, or a PR in `changes-requested` with no new push after 30 min, is released/reassigned (claim label removed, stale worktree removed, branch kept if it has commits).
- **Hand-off contract:** an agent finishes only by setting the next label and leaving a comment (what was done, what's next). An agent that dies leaves the old label, and the sweep recovers it.
- **Fix limit:** 3 failed review rounds → close PR, label issue `needs-human`, move on.

## Merge gate (all must hold)

1. CI green: lint, typecheck, tests, library build, Storybook build (CI workflow to be added in the bootstrap step; today only `pages.yml` exists).
2. Review verdict is pass with no blocking findings.
3. Rebases cleanly on `main`.
4. Diff stays within the issue's `Files:` list.

## Model tiers (token budget)

| Step | Model | Notes |
|---|---|---|
| Orchestrator beat: state checks, labels, sweep, cleanup | Haiku | Mostly `gh` commands |
| Assess + write issues | Sonnet | Issue quality gates everything downstream |
| Implement | Sonnet | |
| Review | Opus | Quality gate for unattended merges |
| Fix | Sonnet | Review comments already say what to change |
| Conflict/rebase trouble | Sonnet; Opus on second failure | |

Frugality rules:
- **Idle beat:** one cheap Haiku check; if there is no work and caps are full, exit.
- **Reviews read only the PR diff** (plus the issue text).
- **Implementers get the issue text and its `Files:` list**, not the whole repo.
- **Budgets:** a token budget per beat and per day. When it runs out, the cycle stops cleanly and logs why.

## Scheduling

- Default: a **short timer, a beat every 5 minutes**, running until stopped or the daily budget is spent. Each beat is a short, resumable pass over the state above.
- The orchestrator is one coordinator; worker agents are spawned per task in their own worktrees and report back via labels/comments.

## Assessment focus (what "better" means)

Features missing for a fintech component library; usability (API consistency, sensible defaults, keyboard/screen-reader support); design (modern, Apple/Google/Microsoft-grade polish: spacing, type scale, motion, dark mode, depth); and customizability/uniqueness (theme tokens, density, radii, accent presets, a recognizable visual identity).

## Bootstrap (first tasks, done once before the cycle starts)

1. Add a PR CI workflow (lint/typecheck/test/build/build-storybook). Verify the `lint` script has a working ESLint config; add one if missing.
2. Create the cycle labels.
3. Add the cycle log file and the orchestrator/agent prompt files.
4. Branch protection on `main`: require the CI check and PRs, no direct pushes. *(Outward-facing; needs the owner's OK before it is applied.)*
5. Dry-run one beat with the caps lowered to 1.

## Decisions left to the builder

Exact label names, prompt wording, how the orchestrator is invoked (loop skill vs scheduled routine), CI job layout, log file format, token budget numbers.

## Calls made without the owner (flagged for review)

- The caps (3 / 3 / 2), the timeouts (60 / 30 min), the 3-round fix limit, and the ~300-line diff guideline.
- Squash merges, serialized merges, and Opus for review only.
- Using labels as the state store.
- Branch protection on `main` is proposed but not applied until confirmed.
