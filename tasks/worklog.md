# Work log

## 2026-10-06

| Step | Change | Verify |
|---|---|---|
| 1 | Scaffold: tool `show`, `Pane`, `/diagram`, state `current` | validate, tsc, `plugin test` 1 pass |
| 2 | Live call failed: `no tool.call hook answered`. Matched the tool by name suffix instead of `{ tool }` (no effect) | still failed live |
| 3 | Added `try/catch` to the tool hook. The error then showed `undefined ... input.title` | error seen in a live call |
| 4 | Root cause: the args are flat on `e`. Fixed the hook and the test (the test had the same bug) | live call OK, user saw the pane |
| 5 | Visuals: round frame, title bar with time, coloring by char class, Unicode box chars in the tool description | 2 tests, tsc |
| 6 | Removed emoji (user feedback: hard to read) | live redraw |
| 7 | Copied the mod to `~/jason/side-diagram`, added `marketplace.json` (source `./`), README, `.gitignore` | validate, test in new path |
| 8 | Added: rule for ASCII-only labels inside boxes, history `p`/`n` (20), `Q1:` block in green, copy `c`, `/diagram off\|on` | 3 tests, tsc, user checked live |
| 9 | Added the `prompt.compose` rule `side-diagram:rule` | 4 tests, tsc |
| 10 | README: focus keys, install answers, update flow, OSC 52 limit | review only |

## Open

- [ ] Run `/plugin install side-diagram --marketplace /home/ec2-user/jason/side-diagram` in a new session.
- [ ] Watch how often Claude draws with the `prompt.compose` rule. Tune `RULE` if needed.
- [ ] Check whether the `{ tool: 'mcp__side-diagram__show' }` matcher works now. If it does, go back to it (ADR 4).
- [ ] `git init` and push for backup.
- [ ] No test covers `ui.render` (mount on terminal and desktop).

## Lessons

- When the engine says "no hook answered", add `try/catch` that returns the error first. Do not guess from the code.
- A test that builds its input the same wrong way as the code proves nothing. Build test input from the type (`ToolCallReserved` + args), not from the code under test.
