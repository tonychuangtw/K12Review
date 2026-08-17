STATUS: in-progress

# 解析確認題（完整版）內容撰寫（Tony 2026-08-17 指示「照建議做完整版，直接一次做完」）

## 機制（已完成，v39 上線）
- 資料：`js/data/checks-{idioms,phonics,chars}.js` → `window.APP_CHECKS[id] = {q, o:[4], a}`
- 前端：公布解析後追問確認題，答對才給「下一題」；答錯 ⇒ `demoteWrong()` 把原題重排錯題本（隔天複習、連對歸零），不另生新錯題
- 沒有 chk 資料的題目 → 退回解析鎖倒數（v37）
- 統計：`state.chk[日期]={n,ok}` → 家長檢視 tile／日期明細／週報顯示答對率（<60% 標⚠️）
- 守門：`node test/test.js`（格式、答案分散、不可與原題答案相同、印覆蓋率）；`CHK_FULL=1 node test/test.js` 會要求 100% 覆蓋
- DOM 行為：`node test/browser-smoke.mjs`（含確認題答對／答錯／無資料退回倒數）

## 撰寫規格（逐條人工寫，不可交 subagent）
- 題目必須「答案只在剛看過的解析裡」：字形＝拆解／部首／造字原因／記法；字音＝注音比較（某讀音對應哪個詞）；成語＝典故人物事件、字面／引申、用法褒貶
- 4 選項不重複、誘答要合理（多取自同題解析裡的其他字詞說明）；答案索引 0-3 平均分布
- 字形題的正解不可等於原題答案本身（test 會擋）
- 工具：`scratchpad/dump.js <cat> <from> <count>` 傾印欄位；`scratchpad/addchk.py <cat> <batch.json>` 併檔（自動排序去重）

## 進度
- [x] 字形 chars：660/660 ✅ 全部完成
- [x] 字音 phonics：660/660 ✅ 全部完成
- [ ] 成語 idioms：0/1200
- 每批 30 題；每 5 批 commit push 一次

## 完成後要做
- [ ] `CHK_FULL=1 node test/test.js` 打開 100% 覆蓋守門，並把這行寫進 CLAUDE.md 改動守則
- [ ] 回報 Tony：三類覆蓋率、抽樣例題、家長檢視看得到的新指標
- [ ] STATUS 改成 done

## 已結案（不用再做）
- 閱讀擴充批1（r187–r198）／批2（r199–r210）；LanExamMock reading wave7（五級各 3 篇）
- 手寫錯題在測驗裡仍手寫（v37）／總結測驗不算自主練習（v37）／解析鎖（v37）／只考錯題本的錯題測驗（v38）
- 劇情動畫 1200/1200、成語配圖 1200/1200（2026-08-15）
