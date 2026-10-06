---
status: accepted
date: 2026-10-06
---

# 歷史圖存在 session `$.state`（最多 20 張），不跨 session

**情境**：一堂課會畫多張圖，需要翻回前面的。

**決定**：`$.state` 存 `history`（上限 20）與 `index`。pane 用 `p`/`n` 翻頁。

**為什麼**：每堂課的圖只跟該 session 有關。新 session 從空白開始比較乾淨。

## Considered Options

- **只留最新一張**：否決。使用者要求翻頁。
- **`$.store` 跨 session 保存**：否決。舊課的圖會混進新課。

## Consequences

- 關掉 session 後歷史消失。要留存時用 `c` 複製到筆記。
