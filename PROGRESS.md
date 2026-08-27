# 進度：家長／老師檢視改版（K12Review ＋ LanExamMock）

<!-- 交接檔表頭。規格見 claude-shared/claude-md/shared.md §17。 -->

STATUS: in-progress
OBJECTIVE: 依 Tony 2026-08-27 回報，把兩站的家長／老師檢視做到「一頁看完每一科、每一種練習分開的題數／正確率／用時」，並加上防亂寫機制
NEXT_ACTION: 兩站分項統計都已上線（K12Review v64 b9fbfec／LanExamMock v32 fe9db51）。只剩 LanExamMock 防亂寫，等 Tony 回是否照「解鎖秒數改依內容長度算」這個單一改動做（訊息 id 925）。⚠️ 前兩版提案都作廢：正確率門檻會冤枉做 CAE/CPE 的女兒；用他自己的作答時間中位數當基準也不行——他現在的資料全是亂做的，基準本身就是髒的。細節見下方「防亂寫（第三版）」
VALIDATION: cd ~/TelegramClaude/chinese && node test/test.js 全過、node test/zy-check.js 0 不一致、node test/browser-smoke.mjs 全過；LanExamMock 改完跑 cd ~/TelegramClaude/LanExamMock && node test/test.js
BLOCKERS: 等 Tony 選防亂寫項目（訊息 id 919 已問）
PATHS: js/app.js（K12Review：tlog 分項計時／showParent／showDayDetail／renderSubjects）、css/style.css（.pt-tbl）、js/versions.js、test/browser-smoke.mjs、~/TelegramClaude/LanExamMock/js/app.js
UPDATED: 2026-08-28 01:35 台北

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

## 待辦：LanExamMock 防亂寫（第三版，等 Tony 回）

**兩個被推翻的前提（都是 Tony 2026-08-27 當場指出的）**
1. 不能用正確率當態度指標——女兒做 CAE/CPE 認真做也常低於 60%
2. 不能用「他自己的作答時間中位數」當基準——他現在的資料全是亂做的，基準會被汙染。
   而且 Tony 明說「不希望真的太長太久」，所以任何「加題／重做」的懲罰都要先擱著

**結論：基準要從題目內容來，不能從使用者行為來。**

現況（`d25ApplyLock`，js/app.js 約 3474）已經有鎖，但秒數是寫死的，太短：
閱讀題組第一題 8 秒、同篇之後 4 秒、一般題 3 秒、聽力要按播放。8 秒讀完一整篇＝形同虛設。

要做的單一改動：**解鎖秒數改成依內容長度算**
- 閱讀題組第一題 = 文章字數 ÷ 6 字/秒（≈360 wpm，遠快於一般青少年 200–250，是保守下限），上限 90 秒
- 一般題 = （題目＋選項字數）÷ 6 ＋ 2 秒，上限 20 秒
- 聽力改成「播完」才解鎖，不是「按下播放」就解鎖
- A′ 解析確認題、B′ 重做**都先不做**（會讓作業變長）；任務長度也先不鎖，
  改成家長頁顯示「今天把長度調成幾題」
- 一週後用家長頁的分項計時看他真實的作答時間中位數，再決定要不要加規則

原始選項與演進過程（保留備查）：

**設計前提（Tony 2026-08-27 定案）**：兩個小孩程度差很多——女兒做 CAE/CPE 很自動但正確率天然低，
兒子做 FCE 是亂按的那個。**所以認真與否只能用「有沒有花時間想」判定，不能用正確率**。
好消息是 LanExamMock 每個 localStorage key 都有級數前綴（`fce.` / `cae.`），設定天然分級數各存各的，
規則設在 FCE 不會套到 CAE/CPE，不管兩人是同帳號還是兩帳號。

- **Ａ′ 解析確認題只追問「秒殺又答錯」的題**，認真想過才答錯的不追問
- **Ｂ′ 重做的觸發改成「秒殺題數」**：當天 ≥3 題秒殺答錯 → 只重做那幾題（不是全部錯題）
- **Ｃ′ 任務長度不鎖死，改家長可設下限**（例：FCE 下限 15、CAE/CPE 不設）；沒設＝維持現狀
- **「秒殺」門檻**：不用固定秒數。用該使用者「該題型最近 30 題作答時間的中位數」當基準，
  低於中位數 25% 才算；資料不足退回保守預設（寧可放過不要誤判）。
  現成材料：`quiz.times[]`（每題秒數）、`drill.answersReadyAt`、`d25.rush`／`rushStreak`／`slowdown`

原始選項與 Tony 的顧慮（保留備查）：

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
