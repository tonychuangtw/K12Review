# 進度：家長／老師檢視改版（K12Review ＋ LanExamMock）

<!-- 交接檔表頭。規格見 claude-shared/claude-md/shared.md §17。 -->

STATUS: in-progress
OBJECTIVE: 依 Tony 2026-08-27 回報，把兩站的家長／老師檢視做到「一頁看完每一科、每一種練習分開的題數／正確率／用時」，並加上防亂寫機制
NEXT_ACTION: 兩站的「分項統計」都已完成上線（K12Review v64 commit b9fbfec／LanExamMock v32 commit fe9db51，含 568 min bug 與拼寫回合不計時）。只剩防亂寫要 Tony 選：A 解析確認題／B 低正確率要重做到全對／C 家長鎖任務長度／D 每題最短作答時間／E 家長頁標紅（我建議 A+B+C，訊息 id 919 已問）。選完改 ~/TelegramClaude/LanExamMock/js/app.js
VALIDATION: cd ~/TelegramClaude/chinese && node test/test.js 全過、node test/zy-check.js 0 不一致、node test/browser-smoke.mjs 全過；LanExamMock 改完跑 cd ~/TelegramClaude/LanExamMock && node test/test.js
BLOCKERS: 等 Tony 選防亂寫項目（訊息 id 919 已問）
PATHS: js/app.js（K12Review：tlog 分項計時／showParent／showDayDetail／renderSubjects）、css/style.css（.pt-tbl）、js/versions.js、test/browser-smoke.mjs、~/TelegramClaude/LanExamMock/js/app.js
UPDATED: 2026-08-28 00:40 台北

## 已完成：K12Review（v64）

Tony 的三個抱怨與對應修法：

1. **「用時是每日練習還是全部？第一次答對是每日練習的？」** — 舊版只有 `state.daily[].ms` 記得到用時，
   其餘練習完全沒計時。新增總帳 `state.tlog[日期][科目][練習項目] = {ms, n, ok}`：
   - 項目：daily／review／unit／drill／normal／import／retry／write／search／concept／lesson／flash／writing
   - `logAct()` 在每題「第一次作答」記題數與答對數（掛在 bumpStat 旁邊，成績口徑一致）
   - 計時器 `clk*`：以停在練習畫面上的時間計，2 分鐘沒操作就不再累計；測驗畫面由 `paintSnap`
     依「當題的科目」起算（subjOfCat），其他練習畫面由 `render()` 依 `VIEW_ACT` 起算
   - 只留 60 天；不自行 save()，靠作答時的 bumpStat 一併寫入，切頁／切背景／關頁面再補存
2. **「從哪科進去就單看那科，很麻煩」** — 家長／老師檢視搬到最外層（選科目頁最下面一張卡），
   並新增「學習總覽」表：科目一列（該科總計）＋底下每種練習各一列＋全部總計，可切今天／近 7／近 30 天
3. **「分類也怪怪的」** — 各題型正確率改成依科目分組，不再把成語跟 mathCustom 混在一串

其他：每日紀錄點日期進去多一段「⏱ 各項練習（全科合計 X）」；「用時」「第一次答對」改寫成
「每日練習用時」「每日練習第一次答對」；家長頁頂端摘要同步改字。

舊資料相容：`tlogAgg()` 會把 `state.daily`（每日練習）與 `state.review`（總結測驗）的既有 ms／題數
補進總覽並標 legacy，畫面上會註明分項計時是 2026-08-27 起才開始記的。

## 已完成：LanExamMock（v32，commit fe9db51）

- 新增 `LEVEL.tlog[日期][項目] = {ms, n, ok}`，9 種練習（daily／spell／uoe／reading／
  listening／vocab／writing／speaking／review）各自記時間與題數。項目由「目前開著的分頁」
  決定（`curAct()`／`TAB_ACT`），拼寫回合優先判成 spell；計時同 K12Review，2 分鐘沒操作就停
- 家長頁新增 **Time & accuracy by activity** 表，今天／近 7／近 30 天可切，最後一列 Total；
  舊資料用 daily25 的題數與 ms 補位並標 legacy
- `d25Complete()` 用時加 2 小時上限（`D25_MS_CAP`），Daily practice history 的用時改讀 tlog、
  並在拼寫分數旁標出拼寫用時 → 8/21 那筆 568 min 不會再出現
- `test/browser-smoke.mjs` 新增 6 條家長頁測試（全過；`node test/test.js` 122,015 全過）

## 待辦：LanExamMock 防亂寫（等 Tony 選）

Tony 2026-08-27 回報（附 Daily practice history 截圖）與查證結果：

- **題數是自選的**：8/24 加的「Daily 10/15/20」，實際題數 = 選的長度 + 最多 1–2 題到期錯題
  （21=20+1、15、11=10+1）。小孩 8/25 調成 15、8/27 調成 10。→ 選項 C 要把這顆按鈕鎖給家長
- **4 分鐘不含 ✍️ 拼寫**：`d25Complete()` 存完 `rec.ms` 之後才跑拼寫回合，`dspComplete()` 只補
  `rec.spell`，沒有再更新 ms。拼寫那段目前完全沒計時
- **8/21 的 568 min 是 bug**：`d25SaveRun()` 存 `elapsed`，續做時 `t0 = Date.now() - elapsed`，
  隔天回來續做就把中間那段全算進去。要加單日上限
- **現有防亂寫只有一層**：解鎖後 2.5 秒內答錯算 rushed，連 2 次罰等 8 秒（`d25.rush`／`slowdown`）

## 前一個案子（已結案）

K12Review codex 體檢修正：A/B 兩級全部修完上線（5c578c0／396a792／8b92341／後端 5595871）。
2026-08-27 Tony 裁示剩下兩項維持現狀不改：(1) 同步的資料最小化與 opt-in (2) token 存 localStorage
與 CSP。以後再有人提這兩點直接引裁示，不用重問。
