# Model003 成年女性獨立候選 002（V0.4.95）

來源仍是 Google Drive `AG_MODEL003_製作原始檔_純原始碼.zip` 的 Model003 18 骨架架構；Special3 禁止作成年女性基底。

V0.4.94 技術流程已 PASS，但八方向實拍外觀 FAIL：肩部與腰胯有明顯破口、四肢分節玩偶感重、眼睛過大幼兒化、髮束過粗硬，因此未接入遊戲。

V0.4.95 增量修正：拉高成年比例、縮小頭與眼睛、重做肩袖重疊、改為連續高腰長褲遮蔽腰胯破口、四肢更細長、長髮束細化。另清除腿部權重為 0 但仍保留 joint index 的無效權重項目，以降低 Validator `ACCESSOR_JOINTS_USED_ZERO_WEIGHT` 警告。

保留：18 骨架、7 換裝槽位、Idle / Walk / Run / Jump / JointInspection。本候選完全獨立，不接入正式 `bootstrap-v045.js`。CI PASS 不代表外觀 PASS；必須以實際匯出 GLB 的八方向 Render 判斷，`appearanceAccepted` 仍為 false。
