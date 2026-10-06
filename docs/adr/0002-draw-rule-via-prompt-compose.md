---
status: accepted
date: 2026-10-06
---

# 「何時畫圖」規則由 mod 用 `prompt.compose` 注入，不寫 CLAUDE.md

**情境**：只靠 tool description，model 畫不畫不穩定，在 skill 流程中常被忽略。

**決定**：`prompt.compose` 在 system prompt 最後加 section `side-diagram:rule`（scope `session`）。暫停中、無 surface（`claude -p`）、或 tool 未提供時不加。

**為什麼**：規則跟 mod 同生命週期。mod 移除或 `/diagram off` 時規則一起消失。

## Considered Options

- **寫進 `~/.claude/CLAUDE.md`**：否決。mod 關掉後規則殘留，model 會找不到 tool。
- **只靠 tool description**：否決。實測不穩定。

## Consequences

- 規則放在 cache boundary 之後，切換 `/diagram off|on` 只影響 session 段 cache。
- 頻率調整改 `hooks/register.tsx` 的 `RULE`。實際頻率尚未觀察。
