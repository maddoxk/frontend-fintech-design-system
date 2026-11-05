# Cycle orchestrator (run on Haiku, one beat)

Repo: maddoxk/frontend-fintech-design-system. State lives in GitHub labels. Never work on `main`.
Spec: docs/superpowers/specs/2026-11-04-improvement-cycle-design.md

Each beat, in order. Stop the beat early if the budget in `.claude/cycle/budget.md` is spent.

1. **Snapshot** (cheap): `gh issue list --label cycle:ready|cycle:claimed --json number,labels,updatedAt,body` and `gh pr list --json number,labels,updatedAt,headRefName,mergeable,statusCheckRollup`.
   If there are no open cycle issues/PRs and both caps are full or nothing is pending, exit with one log line.
2. **Sweep**: `claimed` issue with no PR after 60 min -> remove `cycle:claimed`, add `cycle:ready`, comment. PR in `cycle:changes-requested` with no push for 30 min -> spawn a fixer (fix.md). Any item over 3 review rounds -> close PR, label issue `cycle:needs-human`.
3. **Merge/review**: for each PR labelled `cycle:in-review` with CI green -> spawn reviewer (review.md, Opus). Pass -> run merge steps below. Fail -> label `cycle:changes-requested`.
4. **Fix**: for each `cycle:changes-requested` PR -> spawn fixer (fix.md, Sonnet).
4b. **Unblock**: for each `cycle:blocked` issue whose "Blocked by #n" issue is closed and whose `Files:` do not overlap any claimed issue or open PR, swap `cycle:blocked` for `cycle:ready` (at most one per beat, oldest first).
5. **Implement**: only if fewer than 2 PRs await review/fix and fewer than 3 open cycle PRs: pick the oldest `cycle:ready` issue whose `Files:` do not overlap any claimed issue or open PR; spawn implementer (implement.md, Sonnet) in its own worktree.
6. **Assess**: only if `cycle:ready`+`cycle:claimed` < 3 and open cycle PRs < 3: spawn assessor (assess.md, Sonnet).
7. **Log**: append one line to `.claude/cycle/log.md`.

## Merge steps (one merge per beat)
Rebase branch on latest `main`; if conflicts, one Sonnet attempt, else `cycle:needs-human`. Re-check CI is green and diff is within `Files:`. Then `gh pr merge <n> --squash --delete-branch`. Remove the worktree, delete the local branch, confirm the issue closed, append to log.

## Rules
- Every agent ends by setting the next label and commenting what was done and what is next.
- Pass agents only the issue text, its `Files:` list, or the PR diff. Never ask them to read the whole repo.

## Tooling note
On this machine `gh issue edit` and `gh issue comment` fail with a Projects-classic GraphQL error. Change labels and post comments with `gh api` instead (e.g. `echo '{"labels":["cycle:claimed"]}' | gh api -X POST repos/maddoxk/frontend-fintech-design-system/issues/<n>/labels --input -`, `gh api -X DELETE .../issues/<n>/labels/<name>`, `gh api -X POST .../issues/<n>/comments -f body=...`).
