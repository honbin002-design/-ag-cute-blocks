# AG Cute Blocks V0.4.5 — 集中 iPhone 驗收批次

這份清單針對 `dev-v0.1` runtime52 的整合版本。它是驗收順序與證據界線，不代表任何項目已經 PASS。

## 驗收前提

- 使用最新 GitHub Pages deployment，確認載入的是 `ag-cute-blocks-v045-runtime52`。
- 先保留目前裝置上的既有 local save；不要清除資料或重置世界。
- 每個項目完成後記錄：裝置／瀏覽器、操作結果、是否重現、必要時附截圖或短片。
- 已鎖定的「一手指持續推移動搖桿、另一手按 Jump」PASS 不重測；只有未來修改輸入路徑才重新開啟。

## 集中驗收順序

1. **既有世界與重新載入**
   - 開啟既有世界，確認玩家位置、已放置方塊、家具、作物、果樹與動物仍在。
   - 放置或移除一個物件後重新載入，確認正常保存；不可把 runtime index 當成取代 full snapshot。

2. **三種視角與方向**
   - First Person、Third Person、Farm View 各走直線、斜線、急停與連續轉向。
   - Third Person / Farm View 中，確認人物臉與身體朝實際移動方向，不因鏡頭方向倒退走。
   - 這一項仍只收集 heading／turn／stop 證據，不宣告最終 locomotion 或 final art。

3. **附近互動與建造瞄準**
   - 靠近／離開椅子、床、沙發、作物、果樹、寵物與家畜，確認互動提示只在合理距離出現。
   - 建造時測試地面、水面、方塊、家具的瞄準，以及新增、旋轉、刪除後再次瞄準。
   - 確認新增或移除物件後，提示與瞄準沒有殘留舊目標。

4. **建築與材質**
   - 測試 cube、rectangular prism、sphere、cylinder、triangular prism、slope、roof、stairs。
   - 測試木材、深木、石材、磚、混凝土、大理石、金屬、玻璃、磁磚、陶瓷。
   - stairs 放置後確認碰撞、移動與重新載入仍合理；此項仍是 integrated building，不是 final material/art PASS。

5. **雨水、雷雨與性能**
   - Sunny、Rain、Thunderstorm 各切換一次，確認雨／雷雨視覺與柔和 puddle 層出現，沒有破壞性災害。
   - 觀察低階或短高度手機版面是否仍可操作；若有掉幀、過度閃爍或遮擋，記錄 weather／performance tier。

6. **人物、寵物與家畜動作**
   - 玩家 walk、run、急停、轉向；狗／貓 walk、run、急停、轉向、sit／sleep。
   - 特別觀察狗／貓 paw 是否跟著腿 pivot、是否貼地、是否滑步或急停後殘留動作。
   - 牛／羊／雞分別觀察步態節奏與物種差異。
   - 結果只能標記 `device evidence collected`；未通過全部觀察前，不標記 visual／locomotion PASS。

7. **家具生活與安全起身**
   - 椅子、沙發、床、長椅、鞦韆、用餐、睡覺各測一次。
   - 互動後確認自動對準、不穿模、可安全起身；睡醒與重新載入後不可卡在家具內。
   - 若任何出口位置不安全，記錄家具類型、相機模式與位置。

## 證據標記

- **INTEGRATED**：程式已接入 bootstrap／core pipeline。
- **CI PASS**：GitHub Actions invariant／syntax 通過。
- **DEPLOYED**：Pages Build/Deploy 通過。
- **REAL DEVICE PASS**：iPhone 上該項目實際通過，且有本批次證據。
- **FINAL PASS**：只有完成正式美術、操作與長期遊玩標準後才可使用；runtime49 不預先宣告。

## 本批次明確不做

- 不清除或覆蓋既有 saves。
- 不把 local World/Chunk Index 當成 shared multiplayer。
- 不重新測已鎖定的 movement + Jump multi-touch。
- 不把 procedural intermediate art、CI 或 Pages deployment 誤報為 final art／real-device PASS。


## 8. 人物個人化與連續骨架模型（runtime45-51）
- 開啟「⚙️ 管理者」設定，確認性別、身形版型、膚色、髮型、髮色、服裝樣式、上衣、下身、帽子、眼鏡與配件選項都能看到。
- 逐一更換至少兩組差異明顯的組合，確認人物外觀立即更新，且位置與朝向不被重置。
- 關閉設定後再次開啟，確認選項保留；完全關閉主畫面 App 後重新開啟，確認個人化外型仍保留。
- 這項只驗證本機玩家個人化；多人連線與跨裝置同步尚未實作。

- runtime46 先加入 premium-chibi-v2 的眼睛、髮束、分層服裝與配件細節；runtime47 再同步放大頭身比例、軀幹、肩臂、手掌、腿部與鞋底；runtime48 修正五官與髮束被頭部幾何遮住的深度問題；runtime49 導入連續網格 rigged GLB 技術版本；runtime50 修正新 GLB 被舊 primitive fallback 的 visual 容器一起隱藏的問題，現在只隱藏舊幾何子物件；runtime52 修正骨架模型方向，並將女生技術模型從大帽子的 Mage 改為 Rogue。Farm View 也加入上下調整角度與雙指拉近拉遠。此部分仍須以 iPhone 實際視覺判定，不能以 CI 取代美術驗收。


## 9. 牧場視角操作（runtime52）
- 在 Farm View 於遊戲畫布上用單指上下拖曳，確認視角可以向上／向下調整；左右拖曳確認水平環繞角度可以改變。
- 用兩指在遊戲畫布上捏合，確認可以拉近／拉遠；不要在左側移動搖桿或右側動作按鈕區操作。
- 確認調整後切換視角或重新開啟 App，鏡頭仍可正常使用；這項只驗證鏡頭控制，不重新驗收已通過的邊走邊跳。


## 10. 人物更衣室／紙娃娃（下一個模型門檻）
- 目前只記錄需求，不把既有整合服裝 GLB 誤標成內衣褲骨架檢視或完整紙娃娃。
- 正式驗收前提：連續 base body 可單獨顯示；日常服、禮服、髮型與配件為可獨立替換層；性別與外型設定可保存並在重新載入後還原。
- 這項尚未進入 REAL DEVICE PASS。