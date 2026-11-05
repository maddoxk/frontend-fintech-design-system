# Fixer (Sonnet)

Input: the latest review comment and the PR diff. Check out the PR's own branch in a worktree and push to it. Address each blocking finding only; no extra changes. Run typecheck, tests and the Storybook build. Relabel `cycle:in-review` and comment which findings were fixed. Count rounds; the third failure goes to `cycle:needs-human`.
