# 進度：五上社會題庫轉入 K12Review

STATUS: in-progress

來源：Tony 2026-08-18 Telegram 傳的 `五上社會題本檔案-20260818T135214Z-1-001.zip`
（本機解壓在 scratchpad `social/`；原始 zip 在 `~/.claude/channels/telegram-chinese/inbox/1787061366316-AgADtiUAAn4xIVQ.zip`，
副檔名寫 .doc 其實是 docx，用 `zipfile` + `word/document.xml` 解析，**不要**用 tools/doc-extract.py）

原始題數：**1,948 題**（41 檔、5 種卷別 × 10 課 + TASA；題號不重複）

## 轉檔規則（沿用 CLAUDE.md 自創題庫規格）

- 檔案：`js/data/social.js`（`window.APP_DATA.social`），一題一行 JSON
- id = `o` + 原題號（可回溯原檔）；grade 5；book `五上`；lesson `第N單元 X.課名`（TASA 為 `TASA 綜合測驗`）
- qtype 用原題型；diff 取原難易度；src 記卷別（題庫/習作/素養題/強化演練/TASA）
- exp＝原「詳解」一字不動保留在最前 ＋ `✅ 正解：…` ＋ `📚 知識點：…` ＋ 出處
- 解析器：scratchpad `social/parse.py`（產 items.json）、`conv1.py`（批1）、`emit.py`（產 social.js，含手工修正表 FIX）
- ⚠️ 原題本自身的瑕疵（例：o1505000857 兩個選項都是「法律」）在 emit.py 的 FIX 表逐題修，不要改解析器

## 批次進度

- [x] 批1 選擇題 703 ＋ 高層次思考題 142 → 轉出 **830 題**（15 題有圖，留給批5）
- [ ] 批2 是非題(單題) 589 → ○╳ 二選一，缺詳解者補正解說明
- [ ] 批3 活用題 31（拆成每小題 ○╳）、勾選題 87（每個選項拆一題 ○╳）、圈圈看 26（每格拆二選一）、排出正確的順序 6（自撰 3 個錯序選項）
- [ ] 批4 填填看 95、回答問題 83、配合題 54（逐格拆單題）→ 需逐題自撰誘答，**不可交 subagent**
- [ ] 批5 有圖的題（看圖回答問題 42、連連看 34、題組題 56、其他有圖 15）→ 先抽 `word/media` 圖檔判讀，能文字化的文字化，純圖形連連看可能整批不收（要回報 Tony）

## 前端狀態（已完成，2026-08-18 v42）

- 科目通用化：`bankCat()/curSubj()/subjKey()/subjMap()/refIsCur()`；國語專屬卡片標 `data-cn="1"`
- 社會可用：每日練習（種子＝日期|科目）、總結測驗、單元學習（重點卡，單元照冊切）、依課練習、依序刷題、錯題本、學習進度、搜尋
- 各科紀錄分離：daily key 加 `|social`、review 記 `subj`、units key 加科目前綴、錯題本依科目過濾
- 測試：`node test/test.js`（社會題庫套用自創題庫那組守門）、`node test/browser-smoke.mjs`（新增「社會科」段）

## 待辦（前端）

- [ ] `tools/weekly-report.js` 目前只讀純日期的 daily key，社會的 `|social` 紀錄沒進週報
- [ ] 家長儀表板（跨帳號檢視）的日曆同樣只認純日期 key
