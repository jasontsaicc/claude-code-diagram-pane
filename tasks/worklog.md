## 2026-10-06｜建立 side-diagram：右側 pane 顯示 Claude 畫的圖

repo `claude-code-diagram-pane`｜branch `main`｜無 MR（`7d07b4e`）
範圍：新 Claude Code mod。未動雲上資源。

### 完成
| # | 項目 | 內容 | 驗證 |
|---|------|------|------|
| 1 | 骨架 | tool `show`、Pane、`/diagram` | validate、tsc、test 1 pass |
| 2 | 參數位置 bug | 改從 `e` 讀參數，測試同步修 | live 呼叫成功，使用者看到 pane |
| 3 | 視覺 | 圓角框、標題列+時間、字元分類上色、Unicode 框線 | test 2 pass、使用者確認 |
| 4 | 功能 | 中文對齊規則、歷史 `p`/`n`、`Q1:` 綠色、複製 `c`、`/diagram off\|on` | test 3 pass、使用者 live 確認 |
| 5 | 觸發規則 | `prompt.compose` 注入 `side-diagram:rule` | test 4 pass、tsc |
| 6 | 發布 | 搬到 `~/jason/side-diagram`、marketplace.json、README、git init | validate、test |

### 發現
| # | 問題 | 處置 |
|---|------|------|
| 1 | live 呼叫回 `no tool.call hook answered`，訊息不含真正原因 | hook 包 `try/catch` 回 deny 文字，才看到 `input.title` undefined |
| 2 | 單元測試用同樣錯的 `input: {...}` 呼叫，所以沒抓到 bug | 測試改為攤平參數 |
| 3 | 改用名稱後綴比對 tool 是除錯時的猜測，沒解決問題 | 保留，`{ tool }` matcher 是否可用待驗 |
| 4 | HTTPS push 失敗，GitHub 不收密碼 | remote 改 SSH，同 learning-coaches |

### 決策
- 畫圖走 tool 不解析文字：ADR 0001
- 觸發規則用 `prompt.compose`：ADR 0002
- 本機用 folder marketplace：ADR 0003
- 歷史只存 session：ADR 0004
- 畫法限制：ADR 0005
- `/diagram off` 回一般 result 不回 deny：deny 像錯誤，model 可能重試
- `ui.open` 不 await 並 catch：`claude -p` 無 pane 時 tool 仍成功

### 待辦
- [ ] 新 session 跑 `/plugin install side-diagram --marketplace /home/ec2-user/jason/side-diagram`
- [ ] 觀察畫圖頻率，必要時調 `RULE`（`hooks/register.tsx`）
- [ ] 驗證 `{ tool: 'mcp__side-diagram__show' }` matcher，可用就改回
- [ ] 補 `ui.render` 測試（terminal + desktop mount）

### 教訓
- engine 只說「沒有 hook 回應」時，先包 `try/catch` 回傳 error，不要看 code 猜
- 測試輸入照型別建構，不要照被測 code 的寫法
