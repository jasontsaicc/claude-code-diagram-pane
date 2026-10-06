---
status: accepted
date: 2026-10-06
---

# 畫圖走 model 呼叫 tool `show {title, ascii}`，不解析回覆文字

**情境**：要在右側 pane 顯示架構/流程圖。圖的內容只有 model 知道。

**決定**：註冊 tool `mcp__side-diagram__show`。`tool.call` hook 把參數存進 `$.state`，再 `ui.open` pane。參數攤平在 `e` 上（`e.title`、`e.ascii`），不在 `e.input`。

**為什麼**：tool 參數有 schema，內容確定。從 markdown 回覆抓 code block 要猜哪個區塊是圖。

## Considered Options

- **`turn.complete` 解析回覆中的 code block**：否決。無法分辨圖和一般 code，誤判就會蓋掉 pane。

## Consequences

- 何時畫圖變成 prompt 問題，見 ADR 0002。
- 每張圖會在對話中多一筆 tool call。
