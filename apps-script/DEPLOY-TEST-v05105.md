# AG Cute Blocks — TEST Apps Script Bridge 一次性部署

適用候選：V0.5.105 server deployment candidate

## 固定安全設定

- Server source：`apps-script/agcb-save-bridge-v05105.gs`
- Manifest：`apps-script/appsscript.json`
- TEST Folder ID：`1XTOj_YbpfehI4hIjhaKBPw3oI_L3HEpZ`
- PROD Folder ID：`19YNP7hM7O0XevxiCvLsuiy65woggBs3R`
- TEST write：ON
- PROD write：OFF
- PROD read：OFF
- Restore：OFF
- Delete：OFF

## 一次性部署流程

1. 在 Google Apps Script 建立／開啟 AG Cute Blocks TEST Save Bridge 專案。
2. 放入 `agcb-save-bridge-v05105.gs` 與 `appsscript.json` 內容。
3. 先直接從 Apps Script 編輯器執行 `agcbSetupTestBridge_()` 一次；完成 Google 授權後，確認回傳 `environment:'TEST'`、`prodWriteEnabled:false`、`prodReadEnabled:false`、`restoreEnabled:false`、`deleteEnabled:false`。回傳的 token 只複製到 TEST 遊戲設定，不可貼到 GitHub、Drive 公開文件或聊天紀錄。
4. 接著執行 `agcbDeploymentPreflight_()`；只有 `ok:true` 才准部署。
5. 右上角「部署」→「新增部署」→ 類型選「網頁應用程式」。
6. 執行身分選部署者本人（Execute as me / USER_DEPLOYING）。
7. 存取權限必須允許不登入即可呼叫（Anyone / ANYONE_ANONYMOUS 類型），因為 TEST 遊戲會以 HTTPS `fetch` 呼叫 Web App；真正的寫入授權仍由長度至少 32 字元的私有 token 保護。
8. 部署後只使用正式 `/exec` URL；不要用 `/dev` 測試網址作為遊戲 Bridge endpoint。
9. 在 AG Cute Blocks TEST 的 Drive 設定入口填入 `/exec` URL 與 token。
10. 依序執行：`驗證` → `TEST備份`。成功 Gate 必須完成：Probe → Capture → Local SHA-256 → BACKUP → READBACK → environment=TEST → Remote SHA-256 完全一致。

## 禁止事項

- 不得啟用 PROD write/read。
- 不得加入 RESTORE 或 DELETE。
- 不得讓 TEST runtime 讀取實際 PROD 存檔。
- 不得把 token 寫入任何 `ag_cute_blocks_` 前綴 key、GitHub source、公開文件或截圖。
- 任一步驟失敗都不得改動 PROD。

## 驗證成功後

只有真實 Drive TEST BACKUP → READBACK → SHA-256 一致性 PASS 後，才進下一階段歷史快照與受控 Restore TEST；V0.6.0 PROD 仍保持封鎖，直到 Google Drive 完整備份、歷史版本、舊存檔還原與向下相容 Gate 全部 PASS。
