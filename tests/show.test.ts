import { expect, test } from 'claude-code/testing'

test('show tool answers the model', async $ => {
  const r = await $.tool.call({ tool: 'mcp__side-diagram__show', title: 'T', ascii: 'A --> B' })
  expect(r.isError).toBeUndefined()
  expect(r.result).toBe('Diagram shown in the side pane.')
})
