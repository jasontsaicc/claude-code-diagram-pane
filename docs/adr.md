# side-diagram ADR

Status of all entries: accepted, 2026-10-06.

| # | Decision | Context | Consequence |
|---|---|---|---|
| 1 | Claude draws by calling the tool `mcp__side-diagram__show {title, ascii}`. The mod does not parse the text of assistant messages. | A typed payload is reliable. Parsing code blocks out of markdown is fragile. | Diagrams appear only when the model calls the tool, so when to draw is a prompt problem (see 8). |
| 2 | Show the diagram in a `Pane`, opened with `$.ui.open`. | The user wants a diagram on the right side, beside the chat. | A pane opened without a user action only seats at >= 144 columns. `/diagram` opens it by hand. |
| 3 | Read tool args from `e` directly (`e.title`, `e.ascii`). | `tool.call` spreads the args flat on `e`. `e.input` is undefined in a live session. The first test also passed `input: {...}`, so it hid the bug. | The tests call `$.tool.call({ tool, title, ascii })` with flat args. |
| 4 | Use an unfiltered `tool.call` hook that checks the name (`endsWith('__show')`). | This was added while debugging, before the real cause (3) was found. | It still works. The `{ tool }` matcher may also work, but nobody has checked that. |
| 5 | Wrap the tool hook in `try/catch` and return `{ deny: 'side-diagram failed: ...' }`. Call `ui.open` with `void ... .catch()`. | Without it, the engine reports only "no tool.call hook answered", which hides the real error. With no surface (`claude -p`), the pane cannot open. | Errors reach the model as text. The tool call still succeeds when the pane cannot open. |
| 6 | Color each character by its class (`hooks/tokenize.ts`): lines use `suggestion`, arrows use `warning` in bold, text uses `text`. A `Q1:` block uses `success` in bold. The frame uses `claude`. | The user puts visuals first. Theme keys follow the light/dark theme. | This is a heuristic. A `-` `.` `/` `:` between word chars counts as text. A `v` is an arrow only when it stands alone. |
| 7 | The tool description sets the drawing style: Unicode box chars, no emoji, ASCII-only labels inside boxes, lines <= 60 columns, questions last as `Q1:`. | Emoji was hard to read (user feedback). A CJK char is 2 columns wide and breaks box edges. | Chinese notes go below the drawing. |
| 8 | Set when to draw with a `prompt.compose` section `side-diagram:rule` (scope `session`). Do not use `CLAUDE.md`. | The tool description alone was not reliable. The rule must go away with the mod. | The rule is dropped while paused, when there is no surface, or when the tool is not offered. To tune how often Claude draws, edit `RULE`. |
| 9 | Keep the history in session `$.state` (`history`, max 20, plus `index`). Do not use `$.store`. | Each lesson needs its own diagrams. A new session starts clean. | `p` and `n` go back and forward. The history is lost when the session ends. |
| 10 | `/diagram off` makes the tool return a normal result that tells the model to stop. It is not a deny. | A deny looks like an error and can make the model retry. | The model falls back to text until `/diagram on`. |
| 11 | Distribute the mod as a folder marketplace whose source is `./`. | Claude Code reads a folder marketplace from the folder itself. | Edit, then run `/reload-plugins`. There is no reinstall and no version bump. A GitHub install would need `claude plugin update`. |
| 12 | Copy with `$.ui.copy` and pass `press.surface`. | This is the native clipboard path. Over SSH it uses OSC 52. | A terminal without OSC 52 shows `Copy failed: <reason>`. |
