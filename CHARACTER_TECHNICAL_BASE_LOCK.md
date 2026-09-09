# AG Cute Blocks — Character Technical Base Lock

Status: LOCK SPEC
Technical Base: 測試角色3 / UAL角色3
Purpose: 後續人物外型改造時，保留既有可用技術能力；只改外觀層，不得破壞技術母體。

## 1. 正式主線

測試角色3技術完成 → 鎖定為 Character Technical Base → 依使用者提供的參考圖修改外型 → 保留全部既有骨架、動畫、家具與遊戲互動能力 → 再由同一技術母體衍生其他人物。

Manus5 暫停在既有進度，只可作為外型、服裝分件、模型製作與技術參考資產，不得取代測試角色3成為新的正式技術母體。

## 2. 不可破壞的技術層

後續任何外型改造都不得破壞下列能力：

- 既有 UAL 測試角色3骨架與蒙皮關係
- 既有 locomotion：Idle / Walk / Run / Jump
- 既有家具互動：Sit / Sleep / Wake
- 既有正式互動入口：Interact / Fish
- 第三人稱鏡頭與角色跟隨相容
- 角色載入、切換、控制與遊戲世界整合
- movement lock 與家具 active-anchor bridge
- Sit / Sleep 家具 fitting 與 telemetry
- Sit 高度誤差 acceptance：<= 0.03 m
- Sleep 高度誤差 acceptance：<= 0.03 m
- Sleep 床中心 X/Z 誤差 acceptance：<= 0.05 m
- 現有 CI / Gate 契約不得因外型改造失效

## 3. 可修改的外觀層

後續可依使用者提供參考圖調整：

- 頭型、臉型、五官
- 眼睛、眉毛、嘴型
- 髮型、髮量、髮色
- 身材比例與輪廓
- 服裝、鞋襪、配件
- 材質、貼圖、色彩與日系精緻風格

外觀調整不得用「重做一套新角色系統」方式取代現有技術母體；原則是保留技術層、替換或改造視覺層。

## 4. 非阻擋項目

Swim / Dodge 目前不作為 Character Technical Base 鎖定阻擋條件。原因是遊戲核心對應玩法尚未完整實裝；它們可保留動畫／驗收入口，等待玩法層日後接入。

## 5. 後續改造驗收規則

任何由此 Technical Base 衍生的新外型，至少要重新確認：

- 骨架與蒙皮未斷裂
- Idle / Walk / Run / Jump 正常
- Sit / Sleep / Wake 正常
- Interact / Fish 正常
- 家具 fitting 三個數值門檻仍 PASS
- 第三人稱鏡頭正常
- 無明顯穿模、肩膀塌陷、手腳錯位、角色下半身消失
- 停止移動時不殘留走路／跑步動畫

## 6. 外型製作方向

Character Technical Base 鎖定後，下一階段不是重做人物技術，而是以此母體貼近使用者提供的人物參考圖。優先先完成一個角色到可實際遊玩的程度，再確認外型與技術均 PASS，之後才批次衍生其他人物。

## 7. 工作方式

本線後續固定採小段工作：一次只做一個明確子任務，完成即回報 checkpoint；已 PASS 項目不重做，不因換視窗回頭重建。
