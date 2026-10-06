# side-diagram

Claude Code mod: right-side pane that shows diagrams Claude draws via the `mcp__side-diagram__show` tool.

Decisions: `docs/adr/`. Log and open items: `tasks/worklog.md`.

| Control | Action |
|---|---|
| `/diagram` | open pane |
| `/diagram off` / `on` | pause / resume auto drawing (tool returns a "paused" result) |
| `p` / `n` (pane focused: click it, or `ctrl+x` `tab`) | prev / next diagram, last 20 kept |
| `c` (pane focused) | copy title + diagram to clipboard |

## Install

From GitHub:

```
/plugin install side-diagram --marketplace jasontsaicc/claude-code-diagram-pane
```

From a local clone (edits go live with `/reload-plugins`):

```
/plugin install side-diagram --marketplace /home/ec2-user/jason/side-diagram
```

Answer `y` to add the marketplace, pick user scope. Install once.

Update: edit this folder, run `/reload-plugins`. Source is `./` in a folder marketplace, so Claude Code reads this folder, not the install copy; no reinstall or version bump. (A GitHub install runs a copy instead: `claude plugin update` then `/reload-plugins`.)

Dev run without install: `claude --plugin-dir /home/ec2-user/jason/side-diagram`

## Notes

- When to draw: `prompt.compose` appends section `side-diagram:rule` to the system prompt. Dropped while paused, with no surface (`claude -p`), or when the tool is not offered. Tune frequency by editing `RULE` in `hooks/register.tsx`.
- Tool args arrive flat on `e` (`e.title`, `e.ascii`), not under `e.input`.
- A pane opened unasked (tool call) seats only at >= 144 terminal columns; use `/diagram` below that.
- `Q1:` lines through the next blank line render green bold.
- Tool description forces ASCII-only labels inside boxes: CJK is 2 columns wide and breaks box edges.
- History lives in session `$.state`; it does not survive a new session.
- Copy uses OSC 52 over SSH; terminals without OSC 52 support show `Copy failed`.
- Colors use theme keys (`claude`, `suggestion`, `warning`), so they follow light/dark theme.
- `.claude-plugin/types/` and `tsconfig.json` are engine-generated on load; gitignored.

## Check

```
claude plugin validate . && claude plugin test .
```
