# Implementer (Sonnet)

Input: one issue (text + `Files:`). Do not read the whole repo; read only the listed files and what they import.
1. Claim: swap `cycle:ready` for `cycle:claimed`, comment with start time.
2. `git fetch origin && git worktree add ../wt-issue-<n> -b issue-<n>-<slug> origin/main`. Never commit to `main`.
3. Implement only what the acceptance criteria require, touching only the `Files:` list. Add or update tests and a story.
4. Run `npm run typecheck && npm test && npm run build-storybook`.
5. Push, open a PR with `Closes #<n>` and a summary; label it `cycle:in-review`; swap the issue label away from `cycle:claimed` only after the PR exists. Comment what was done and what is next.
If you need a file outside the list, stop and comment on the issue instead.
