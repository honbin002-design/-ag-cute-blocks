# AG 測試角色登錄表

規則：凡「尚未經使用者實機驗收、且新加入遊戲供篩選」的角色，一律暫名「測試角色N」，依加入順序遞增。驗收後才改為正式角色名稱或淘汰。既有已辨識的歷史角色（角色一～角色五／特殊角色5等）不倒退重編，避免混淆。

| 暫名 | 來源／基底 | 狀態 | 用途 |
|---|---|---|---|
| 測試角色1 | Kenney Blocky Characters 2.0 CC0 / character-a.glb | Rig 基線已部署；未經使用者角色驗收 | 骨架穩定性對照 |
| 測試角色2 | Quaternius CC0 Human / human.glb | Rig 基線已部署；未經使用者角色驗收 | 正常人形比例 Rig 主候選 |
| 測試角色3 | Quaternius UAL2 Female Mannequin / Mannequin_F.glb | 65-joint Rig 結構已確認；必要動作缺口 0；仍有 7 個 visual-pending，未經最終 iPhone 視覺驗收 | 女性 Humanoid 主候選 |

後續新增未測試角色：測試角色4、測試角色5……依序延伸，不重複編號、不覆蓋舊候選。

## 測試 Gate

不因「GLB 可載入／有 Skeleton／有 AnimationClip」直接判定 PASS。必須逐層驗證：

1. 基礎 locomotion：Idle、Walk、Run、Jump、Turn。
2. 生活工作：Fishing、Planting/Farming、Chop、Gather、Build/Work。
3. RPG：Attack、Hit、Dodge；後續再擴充地下迷宮所需動作。
4. 關節完整性：肩、肘、手腕、髖、膝、腳踝不得分離或明顯錯位。
5. 工具掛點：釣竿、斧、鋤、建築工具需可穩定跟隨手部骨骼。
6. 換裝：衣物必須能跟隨同一套骨架變形；不得以只有靜態貼圖視為換裝完成。

## 測試角色3｜目前進度

目前正式契約為 `tests/ual2-rig-contract.json` contractVersion 3。

- Female Mannequin：67 nodes / 1 skin / 65 joints。
- UAL2 Standard：43 clips。
- UAL1 Standard 補件：43 clips；8385/8385 動畫 channel node 命中，結構 100% 相容，但結構 PASS 不等於視覺 PASS。
- AG 原生候選：`AG_Fish_Rod_Loop`、`AG_Sleep_Side_Loop`，直接使用角色3原生 joint names 產生，不新增第三方動畫授權依賴。
- `missingRequiredActions`：0。
- `visualPendingRequiredActions`：Run、Sit、Swim、Generic Interact、Dodge、Fish、Sleep，共 7 項。

已建立 `tests/character3-final-visual-validation.html` 作為最終集中驗收入口，一頁直接檢查上述 7 項。Fish 顯示測試釣竿／魚線，Sleep 顯示測試床面；這些參考物只供判斷持竿姿勢與穿模，不是正式美術資產。

## 判定規則

角色驗收至少區分：外型 PASS/FAIL、Rig PASS/FAIL、動畫 PASS/FAIL、工具掛點 PASS/FAIL、換裝相容性 PASS/FAIL。只有相關項目真的驗過才能標 PASS。

目前禁止把 7 個 visual-pending 項目提前標 PASS；也禁止在最終 iPhone 視覺驗收前，以測試角色3替換正式 V0.5.x 遊戲人物。
