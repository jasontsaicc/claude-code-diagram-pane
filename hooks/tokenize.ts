export type Kind = 'line' | 'arrow' | 'text'
export type Run = { kind: Kind; text: string }

const LINE = new Set('+-|=_/\\:.─│┌┐└┘├┤┬┴┼╭╮╯╰═║╔╗╚╝╠╣╦╩╬┄┆'.split(''))
const ARROW = new Set('<>^▶◀▲▼►◄→←↑↓'.split(''))

// ponytail: per-char heuristic; 'v' is an arrow only when it stands alone
function kindOf(line: string, i: number): Kind {
  const c = line[i]!
  if (ARROW.has(c)) return 'arrow'
  if (c === 'v' && (line[i - 1] ?? ' ') === ' ' && (line[i + 1] ?? ' ') === ' ') return 'arrow'
  // '-' '.' '/' ':' between word chars belong to the word (ws-1, v1.2, a/b)
  if ('-./:'.includes(c) && /\w/.test(line[i - 1] ?? '') && /\w/.test(line[i + 1] ?? '')) return 'text'
  if (LINE.has(c)) return 'line'
  return 'text'
}

// Split a line into runs of the same kind; spaces join the current run.
export function tokenize(line: string): Run[] {
  const runs: Run[] = []
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!
    const kind = c === ' ' && runs.length ? runs[runs.length - 1]!.kind : kindOf(line, i)
    const last = runs[runs.length - 1]
    if (last && last.kind === kind) last.text += c
    else runs.push({ kind, text: c })
  }
  return runs
}

// A line like "Q1:" starts a question block; it runs until the next blank line.
export function questionLines(lines: string[]): boolean[] {
  let inQ = false
  return lines.map(line => {
    if (/^\s*Q\d*[:：]/.test(line)) inQ = true
    else if (!line.trim()) inQ = false
    return inQ
  })
}
