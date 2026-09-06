# AG 測試角色登錄表

規則：凡「尚未經使用者實機驗收、且新加入遊戲供篩選」的角色，一律暫名「測試角色N」，依加入順序遞增。驗收後才改為正式角色名稱或淘汰。既有已辨識的歷史角色（角色一～角色五／特殊角色5等）不倒退重編，避免混淆。

| 暫名 | 來源／基底 | 狀態 | 用途 |
|---|---|---|---|
| 測試角色1 | Kenney Blocky Characters 2.0 CC0 / character-a.glb | Rig 基線已部署；未經使用者角色驗收 | 骨架穩定性對照 |
| 測試角色2 | Quaternius CC0 Human / human.glb | Rig 基線已部署；進入通用 Humanoid 動畫相容性驗證；未經使用者角色驗收 | 正常人形比例 Rig 主候選 |
| 測試角色3 | Quaternius Universal Animation Library 2 Female Mannequin / Mannequin_F.glb | 新增；Rig/外型/動畫/換裝皆未經使用者驗收 | 與 UAL2 同作者女性 Humanoid 對照候選 |

後續新增未測試角色：測試角色4、測試角色5……依序延伸，不重複編號、不覆蓋舊候選。

## 測試角色2｜下一階段 Gate

不因「GLB 可載入／有 Skeleton／有 AnimationClip」直接判定 PASS。必須逐層驗證：

1. 基礎 locomotion：Idle、Walk、Run、Jump、Turn。
2. 生活工作：Fishing、Planting/Farming、Chop、Gather、Build/Work。
3. RPG：Attack、Hit、Dodge；後續再擴充地下迷宮所需動作。
4. 關節完整性：肩、肘、手腕、髖、膝、腳踝不得分離或明顯錯位。
5. 工具掛點：釣竿、斧、鋤、建築工具需可穩定跟隨手部骨骼。
6. 換裝：衣物必須能跟隨同一套骨架變形；不得以只有靜態貼圖視為換裝完成。

## 測試角色3｜用途

先獨立驗證 Female Mannequin 本體的骨架、SkinnedMesh、關節結構與比例，再做與 UAL2_Standard.glb 動作庫的相容性/retarget 測試。若相容，優先評估作為 AG 女性角色骨架基底；若不相容，保留 FAIL 紀錄，不自行重做 Rig。

角色驗收至少區分：外型 PASS/FAIL、Rig PASS/FAIL、動畫 PASS/FAIL、工具掛點 PASS/FAIL、換裝相容性 PASS/FAIL。只有相關項目真的驗過才能標 PASS。
