---
status: accepted
date: 2026-10-06
---

# 畫法：Unicode 框線、不用 emoji、框內標籤只用 ASCII

**情境**：使用者重視視覺。emoji 在終端機看不清楚且吃 2 欄。CJK 字也是 2 欄寬，放進框內會讓右邊框線歪掉。

**決定**：tool description 規定 Unicode 框線（`╭─╮ ┌─┐ ──▶ ▼`）、無 emoji、框內與箭頭上標籤只用 ASCII、每行 ≤ 60 欄、提問放最後用 `Q1:`。中文說明放圖下方。

**為什麼**：model 不會算終端顯示寬度，限制字元集比事後修正對齊可靠。

## Considered Options

- **允許 emoji**：否決。使用者回饋看不清楚。
- **render 時按顯示寬度補空白**：否決。要修改 model 的圖，容易改壞結構。

## Consequences

- 上色靠 `hooks/tokenize.ts` 的字元分類 heuristic（線條/箭頭/文字），`Q1:` 段落另外上色。
