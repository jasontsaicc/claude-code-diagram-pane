export type Diagram = { title: string; ascii: string; at: string }

declare module 'claude-code' {
  interface PluginState {
    'side-diagram': { history: Diagram[]; index: number; paused: boolean }
  }
}
