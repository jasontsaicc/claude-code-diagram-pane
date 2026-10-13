import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Diagram } from '../types'
import { questionLines, tokenize } from './tokenize'

const PANE = 'side-diagram'
const MAX = 20
const history = atom({ plugin: 'side-diagram', key: 'history' } as const, [] as Diagram[])
const index = atom({ plugin: 'side-diagram', key: 'index' } as const, 0)
const paused = atom({ plugin: 'side-diagram', key: 'paused' } as const, false)
const COLOR = { line: 'suggestion', arrow: 'warning', text: 'text' } as const
const RULE = {
  id: 'side-diagram:rule',
  scope: 'session',
  text: '# Side diagram\nThe person learns best from pictures. Whenever you explain an architecture, request/data flow, sequence, state change, or data structure (in normal work and inside any skill or coaching flow), call the side-diagram show tool with a diagram of it, then refer to it in your text. Skip it for plain commands, small code edits, and log reading. One diagram per idea; redraw when the picture changes.',
} as const

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'show',
      description:
        'Show a diagram in the side pane. Call it when an architecture, flow, sequence, or data structure explanation would be clearer with a picture, during learning or normal work. Pick one type first (flow, sequence, state, tree, layers, table) and draw only that. Less is better: max 9 nodes, else split into two diagrams; merge nodes that always go together; drop any arrow the layout already shows; every arrow gets a short label. Keep lines <= 60 columns. Draw boxes with Unicode box chars (╭─╮ │ ╰─╯, ┌─┐ for plain nodes), arrows as ──▶ ◀── │ ▼ ▲. No emoji (unclear in terminals, breaks alignment). Labels inside boxes and on arrows must be English/ASCII only: CJK chars are 2 columns wide and break the box edges. Put Chinese notes below the drawing. Put questions last, starting with "Q1:", "Q2:".',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Short title' },
          ascii: { type: 'string', description: 'The diagram' },
        },
        required: ['title', 'ascii'],
      },
    })
    await $.command.register({ name: 'diagram', description: 'Open the diagram pane; "off" pauses auto drawing, "on" resumes' })
    return next(e)
  })

  // Rule rides with the mod: gone when uninstalled, paused, or no surface (claude -p)
  on('prompt.compose', async ($, e, next) => {
    const r = await next(e)
    const hasTool = e.tools.some(t => t.includes('side-diagram'))
    if (!hasTool || !e.surfaces.length || (await read($, paused))) return r
    return { sections: [...r.sections, RULE] }
  })

  on('command.run', { command: 'diagram' }, async ($, e) => {
    const arg = e.args.trim()
    if (arg === 'off' || arg === 'on') {
      await update($, paused, () => arg === 'off')
      return { text: arg === 'off' ? 'Diagram drawing paused. /diagram on to resume.' : 'Diagram drawing resumed.' }
    }
    await $.ui.open({ id: PANE, title: 'Diagram' })
    return { text: 'Diagram pane opened.' }
  })

  on('tool.call', async ($, e, next) => {
    if (!e.tool.endsWith('__show') || !e.tool.includes('side')) return next(e)
    try {
      if (await read($, paused)) {
        return { result: 'The user paused the diagram pane (/diagram off). Do not call this tool again until they resume; explain in text.' }
      }
      // tool args are spread flat on e, not under e.input
      const input = e as unknown as Diagram
      const at = new Date().toTimeString().slice(0, 5)
      const list = await update($, history, l => [...l, { title: input.title, ascii: input.ascii, at }].slice(-MAX))
      await update($, index, () => list.length - 1)
      // no pane surface (e.g. claude -p) must not fail the tool call
      void $.ui.open({ id: PANE, title: 'Diagram' }).catch(() => {})
      return { result: 'Diagram shown in the side pane.' }
    } catch (err) {
      return { deny: 'side-diagram failed: ' + String(err) }
    }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const list = await read($, history)
    const isPaused = await read($, paused)
    const i = Math.min(await read($, index), list.length - 1)
    const d = list[i]
    if (!d) {
      return (
        <Box borderStyle="round" borderColor="subtle" paddingX={1}>
          <Text dimColor>{isPaused ? 'Paused. /diagram on to resume.' : 'No diagram yet. Ask Claude to draw one.'}</Text>
        </Box>
      )
    }
    const lines = d.ascii.split('\n')
    const isQ = questionLines(lines)
    const go = (step: number) => update($, index, n => Math.max(0, Math.min(list.length - 1, n + step)))
    const copy = async (surface: Parameters<typeof $.ui.copy>[0]['surface']) => {
      const r = await $.ui.copy({ text: d.title + '\n\n' + d.ascii, surface })
      void $.ui.toast(r.isCopied ? 'Diagram copied.' : 'Copy failed: ' + r.reason)
    }
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="claude" paddingX={1}>
        <Box justifyContent="space-between">
          <Text bold color="claude">◆ {d.title}</Text>
          <Text dimColor>
            {isPaused ? 'paused · ' : ''}{i + 1}/{list.length} · {d.at}
          </Text>
        </Box>
        <Box flexDirection="column" marginTop={1}>
          {lines.map((line, n) =>
            isQ[n] ? (
              <Text bold color="success">{line}</Text>
            ) : (
              <Text>
                {tokenize(line).map(r => (
                  <Text color={COLOR[r.kind]} bold={r.kind === 'arrow'}>{r.text}</Text>
                ))}
              </Text>
            ),
          )}
        </Box>
        <Box marginTop={1} gap={1}>
          <Button key="prev" label="◀ p" hotkey="p" dimColor={i === 0} onPress={() => void go(-1)} />
          <Button key="next" label="n ▶" hotkey="n" dimColor={i === list.length - 1} onPress={() => void go(1)} />
          <Button key="copy" label="copy c" hotkey="c" onPress={press => void copy(press.surface)} />
        </Box>
      </Box>
    )
  })
}
