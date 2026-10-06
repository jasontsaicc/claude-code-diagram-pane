import { expect, test } from 'claude-code/testing'

import { questionLines, tokenize } from '../hooks/tokenize'

test('tokenize splits lines, arrows and text', async () => {
  expect(tokenize('│ ws-1 │──▶ db')).toEqual([
    { kind: 'line', text: '│ ' },
    { kind: 'text', text: 'ws-1 ' },
    { kind: 'line', text: '│──' },
    { kind: 'arrow', text: '▶ ' },
    { kind: 'text', text: 'db' },
  ])
  expect(tokenize('   v   ').map(r => r.kind)).toEqual(['text', 'arrow'])
})

test('questionLines marks a Q block until a blank line', async () => {
  expect(questionLines(['box', '', 'Q1: why?', '    because', '', 'Q2: how?'])).toEqual([false, false, true, true, false, true])
})
