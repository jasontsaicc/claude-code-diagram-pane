---
status: accepted
date: 2026-10-06
---

# 本機安裝用 folder marketplace（source `./`），GitHub 只做備份與分享

**情境**：開發中常改。installed plugin 預設跑安裝時的副本。

**決定**：`.claude-plugin/marketplace.json` 放在 repo 根，source `./`。本機用 `/plugin install side-diagram --marketplace /home/ec2-user/jason/side-diagram`。

**為什麼**：folder marketplace 加相對 source 時，Claude Code 直接讀該資料夾。改完 `/reload-plugins` 即生效，不用 reinstall 或升版號。

## Considered Options

- **從 GitHub 安裝**：否決（本機）。每次更新要 push、`claude plugin update`、`/reload-plugins`。
- **`CLAUDE_CODE_PLUGIN_DIRS` / `--plugin-dir`**：否決。要改 env 或每次帶 flag。

## Consequences

- 其他機器仍從 GitHub `jasontsaicc/claude-code-diagram-pane` 安裝。
- `marketplace.json` 的 `owner.name` 在 public repo 會公開。
