# 進度：K12Review codex 體檢修正

<!-- 交接檔表頭。規格見 claude-shared/claude-md/shared.md §17。 -->

STATUS: done
OBJECTIVE: 依 Tony 2026-08-27 指示，把 codex 對 K12Review 全站體檢找出的問題「照建議順序全部解決」
NEXT_ACTION: 無（全案結案）。2026-08-27 Tony 裁示：剩下兩件維持現狀，不改。
VALIDATION: cd ~/TelegramClaude/chinese && node test/test.js 全過、node test/zy-check.js 0 不一致、node test/browser-smoke.mjs 全過；backend 另跑 node test/progress-cas-test.js 與 test/cam-test.js
BLOCKERS: 無
PATHS: js/app.js、js/sync.js、js/data/counts.js（tools/gen-counts.js 產生）、index.html、tools/、test/、~/TelegramClaude/claude-shared/projects/LanExamMock/backend/server.js
UPDATED: 2026-08-27 22:35 台北

## 已完成（三批，皆已 push 並上線）

### 1/6 · commit 5c578c0
- README 刪掉「所有資料只存在 localStorage、無任何網路請求」的錯誤隱私承諾
- `save()` 包 try/catch（無痕模式／空間滿不再中斷答題流程）
- 每日中途進度 `state.dailyRun` → `state.dailyRuns`，key = 科目|年級組合|學期
- 家長檢視的跨帳號 XSS：10 個插值點改用 `escHtml()`，雲端錯誤訊息改 `textContent`

### 2/6 · commit 396a792（最大一塊）
- 首頁初始載入 34.0MB／52 檔 → 3.44MB／17 檔
- 主題庫、匯入題庫、概念卡、動畫引擎全部改成用到才載（`loadScript`/`loadScripts`）
- 新增 `js/data/counts.js`（`tools/gen-counts.js` 產生）：各科各年級題數，每格 {全,上,下}
- `test/test.js` 新增「題數清單」段，清單過期直接測試失敗
- 動態載入的檔案補 `?v=` 版本戳（沿用 app.js 標籤上的戳記）

### 3/6 · commit 8b92341（B 級）
- `pool()` 防呆、混合題「再練一回／再來一回合」修正、首頁「今天還沒做」誤判
- `weekly-report.js`：學期 key 不當成科目、4096 字切段、`require.main` 保護
- `build-bank.js` 先驗再寫＋暫存檔 rename、`append.js` 不再硬寫五上五年級
- `gen-idiom-images.js` 預設 dry-run，要 `--yes` 才打計費 API
- `zy-check.js` 有錯 exit 1、smoke 缺瀏覽器時警告更醒目（`SMOKE_REQUIRED=1` 可視為失敗）

### 後端（claude-shared commit 5595871）
- `PUT /api/progress` 支援 `?baseUpdatedAt=`：與雲端現值不符回 409 並帶回現值
- 新增 `test/progress-cas-test.js`（8 項全過）；服務已重啟
- 前端 `js/sync.js`：push 前的保護性 GET 失敗不再硬推、PUT 帶 baseUpdatedAt、
  收到 409 套用雲端資料重載、新增 `sync.owner` 換帳號防護

## Tony 裁示（2026-08-27 22:30）維持現狀，不改

- **決定 1 · 同步的資料最小化與 opt-in** → 不用改。登入後仍上傳整份 state（含自由書寫全文），家長週報仍送到單一 Telegram chat。這是自家自用站，Tony 接受現行做法
- **決定 2 · token 存放與 CSP** → 不用改。30 天 bearer token 續留 localStorage，不加 CSP（站台跨網域＋要能 file:// 開啟，硬上 CSP 風險大於效益）

以後再有人（含 codex 體檢）提這兩點，直接引這條裁示，不用重問。

## 給接手的人
- 改動題庫數量或 grade/book 欄位後要跑 `node tools/gen-counts.js`，否則 test.js 會失敗
- 動態載入的清單在 `js/app.js` 的 `ensure*` 系列函式；新增大檔一律走那條路，不要加回 index.html
- codex 體檢原始報告在本次 session 紀錄；重跑方式：ssh runner，`cd ~/TelegramClaude/chinese && codex exec -s workspace-write -c model_reasoning_effort=high "<prompt>"`
