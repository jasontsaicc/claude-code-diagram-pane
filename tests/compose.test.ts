import { expect, test } from 'claude-code/testing'

test('prompt.compose adds the rule when the tool is offered', async ($, on) => {
  on('prompt.compose', () => ({ sections: [{ id: 'intro', text: 'hi', scope: 'shared' }] }))
  const base = { model: 'm', promptModel: 'm', surfaces: ['terminal'], outputStyle: null, traits: [] } as const
  const withTool = await $.prompt.compose({ ...base, tools: ['mcp__side-diagram__show'] })
  expect(withTool.sections.map(s => s.id)).toEqual(['intro', 'side-diagram:rule'])
  const noSurface = await $.prompt.compose({ ...base, surfaces: [], tools: ['mcp__side-diagram__show'] })
  expect(noSurface.sections.map(s => s.id)).toEqual(['intro'])
})
