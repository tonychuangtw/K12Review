# chinese — K12學霸養成（全科複習網站，原中文成語俚語複習站）+ 任務線

這是 `claude-telegram@chinese` 線（bot @Tonychinesereviewbot）的 workdir。Tony 在這條線討論這個網站的需求與加題。

## 本線也負責：LanExamMock 英檢站（2026-08-04 Tony 指示移交）

- 劍橋英檢五級站 KET/PET/FCE/CAE/CPE：https://tonychuangtw.github.io/LanExamMock/（repo tonychuangtw/LanExamMock，本機 clone `~/TelegramClaude/LanExamMock`）
- 後端在本機（500）systemd：`lanexammock-backend.service`（127.0.0.1:4100，Tailscale Funnel 對外）＝進度同步 + Kimi K3 作文/口說批改；chinese 站的登入同步也共用這個 API（app=chinese）
- 改動守則：改完必跑 `node test/test.js`（85k+ checks）；內容 UI 一律不顯示中文翻譯（全英文沉浸）；題目原創不可抄劍橋官方題
- 協作歷史在 `claude-shared/projects/LanExamMock/discussion.md`；07-19 起穩定維運，五級站+AI 批改皆已上線

## 專案概要

- 純靜態網站，比照 LanExamMock 模式：vanilla JS、無 build、GitHub Pages 部署、localStorage 存進度
- repo：github.com/tonychuangtw/K12Review（原 ChineseReview，2026-08-04 改名）（Pages 從 main branch root 出）
- 2026-08-02 Tony 拍板的規格：
  1. 年級分層國小1-6／國中7-9／高中10-12
  2. 注音與拼音雙版本（一鍵切換，資料內建兩種標音）
  3. 首發題庫：成語 200、俚語諺語 80、字音 150、字形 150；之後慢慢加
  4. 內容以教育部頒定內容為準；出版社題庫有版權 → 同題型風格**原創出題**，不逐字抄
  5. 手寫＝「看注音寫國字」：畫布手寫 → 翻答案 → 自評對錯 → 錯題本

## 改動守則

- **灌題庫／加題／匯入題庫轉檔一律照 `docs/bank-maintain-sop.md` 的 SOP 做**（2026-08-21 Tony 定案：這類例行工作寫成規則後交低階模型執行；SOP 內含硬規則、驗證步驟與模型分工表）
- 版本紀錄（2026-08-07 Tony 定案，本線所有案子皆同）：每站都有 ℹ️ 使用說明＋版本紀錄頁，資料在各 repo `js/versions.js`（APP_VERSIONS，新版在最上面）。**每次有感的功能改版都要在最上方加一條 vN 條目**（K12Review／LanExamMock／MathReviewWu 皆已建置；新案子上線時一併做這頁）

- 改完必跑 `node test/test.js`（資料完整性 + 題目生成邏輯）和 `node test/zy-check.js`
- 改到前端行為（測驗流程、手寫題、家長檢視）再跑 `node test/browser-smoke.mjs`：無 npm 依賴，用 CDP 驅動 playwright 快取裡的 chrome-headless-shell 真的點過一遍（找不到 shell 會自動跳過）。⚠️ 不要用 `node -e "require('tools/weekly-report.js')"` 檢查語法——那支 require 進去就會真的發週報給 Tony，要檢查語法用 `node --check`
- 加題直接改 `js/data/*.js`，遵守檔頭既有 schema；id 連號不重複、grade 1-12、繁體台灣用字
- ⚠️ **新增字形題（chars.js）後必跑 `node tools/fetch-strokes.js` 補筆順資料**，否則手寫練習顯示答案時沒有一筆一劃的動畫（2026-08-13 Tony 回報；test.js 已加守門，缺字會測試失敗）
- ⚠️ **新增成語／字音／字形題後必須同時寫「解析確認題」**到 `js/data/checks-{idioms,phonics,chars}.js`（`{q, o:[4], a}`，答案只能在該題自己的 deep 解析裡找得到），2026-08-17 起 `test/test.js` 要求 100% 覆蓋，漏寫會測試失敗
- 注音規則：一聲不標調號、輕聲 ˙ 前置、詞注音字間空格；拼音含聲調符號
- 字音以教育部《國語一字多音審訂表》審訂音為準
- ⚠️ **改到 `js/` 或 `css/` 的內容，push 前一定要跑 `python3 tools/stamp-version.py`**（把 index.html 裡本站 js/css 的 `?v=` 換成今天），否則使用者手機會拿到快取的舊檔——GitHub Pages 回 `Cache-Control: max-age=600`，2026-08-21 Tony 回報「我看還是有鎖」就是這個原因（程式已改好、線上檔案也對，只是他手機拿到舊的 app.js）。同一天上第二次版就傳參數：`python3 tools/stamp-version.py 20260821b`
- push 到 main 即自動上 Pages（2026-08-18 起走 GitHub Actions `.github/workflows/pages.yml`＋`.nojekyll`；舊的 legacy Jekyll builder 當天起每次都 duration=0 直接失敗，改成 Actions 後恢復。部署約 4-8 分鐘，用 `gh run list --repo tonychuangtw/K12Review` 查狀態）
- 日期一律用 app.js 的 `fmtDate`（本地時區），不要用 `toISOString`（UTC 會差 8 小時）

## 2026-08-02 之後的擴充

- 登入同步：js/sync.js，後端共用 LanExamMock progress API（app=chinese），詳見本機 memory
- 每日練習：`composeDaily` 以「日期|年級|含以下年級」做種子，同日同設定出同一組題；精熟迴圈錯題重做到全對；紀錄存 state.daily[日期]，進度頁「家長檢視」讀這份
- 成語 `syn`（同義詞陣列）出同義題；`src`（如 "108會考"）標歷屆出處，不確定出處寧缺勿錯
- 閱讀題庫 js/data/reading.js：{id,grade,title,genre,src,passage,questions:[{q,options[4],answer,exp}]}
- 成語配圖：`node tools/gen-idiom-images.js --grades 1-6 --yes`，產 img/idioms/<id>.webp，前端自動載入、載不到自動隱藏。
  2026-08-27 起這支改走共用工具 `claude-shared/tools/gen-image.sh`（訂閱網頁介面，$0，實際跑在 scout），
  **不再直接打 Gemini API**（那吃預付額度，見 shared.md §13；1200 條成語目前都已有圖，只有補新成語才會用到）。
  不加 `--yes` 只會列出缺哪幾張。
- 2026-08-02 二輪擴充：年級改多選（state.grades 陣列，舊 grade/cumulative 自動遷移）；每日練習 25 題＋弱點加權（weakStrong）＋錯題到期混入；錯題排程 bumpWrongSchedule（1→3→7 天三關畢業）；寫作素材 js/data/writing.js；家長週報 tools/weekly-report.js（systemd：chinese-weekly-report.timer，週日 20:00 台北，讀 LanExamMock backend 的 progress.db，bot token 在 ~/.claude/channels/telegram-chinese/.env）
- ⚠️ 題庫內容不可交給 subagent 量產（2026-08-02 四個 agent 全交假貨），加題一律逐條人工撰寫並跑雙測試
- 單元學習：`buildUnits(DATA, grade)` 依 id 序決定性切單元（4成語+2俚語+4字音+4字形），過關狀態存 state.units["gX-uY"]；教學卡 view-lesson、列表 view-units
- 自創題庫轉檔規格（2026-08-03 Tony 定案，之後國中/高中每課一律照此模式）：
  1. **抽文字**：舊版 .doc 用 `python3 tools/doc-extract.py <in.doc> <out.txt>`（自製 OLE+piece table 解析器，免外部套件）；多檔常有重複，以「編號：」去重
  2. **解析題目**：scratchpad parse_items.py 模式切出 {q,ans,exp,num,難易度,出處}；原檔「解析：」欄位**一字不動保留**在 exp 最前（僅 à→→ 正規化）
  3. **機械轉換**：四選一單選直接轉；閱讀題組拆子題（文章附題目前）；配對題（參考選項Ａ-Ｊ/甲乙丙）逐格拆單題
  4. **手工轉換**（不可交 subagent）：寫國字/寫注音/注釋/改錯字/填空/翻譯 → 逐題自撰誘答選項；翻譯題自撰似是而非誤譯
  5. **解析規格**（全題必附，測試把關零缺漏）：
     - 字音/字形類：原解析＋「📚 注音比較」＋「國字拆解與造字原因」（部首聲符辨析、無此音標示）
     - 成語類：原解析＋「📚 典故與成語意思」（出處考證，寧缺勿錯）＋各選項成語意思
     - 其他類（注釋/翻譯/常識/配對）：解析含正解說明＋各選項字義/詞義
  6. **欄位**：id x 連號、book（冊如"八上"）、lesson（如"第2課"）、tag（課名）、diff（易/中/難，取原檔難易度）、qtype（字音/字形/成語/閱讀/配對/解釋/常識/文意/翻譯/綜合）、answer 為索引
  7. **驗收**：原題編號零漏轉盤點 → `node test/test.js` 全過 → commit push → 回報 Tony 題數統計
  - 答案不明的題要回問，不可用猜的；批次進行、每批 commit 保進度
- 錯題本保留制（2026-08-02 二次定案，推翻同日稍早的「答對即移除」）：答對記連對次數並延後 due（3→7→14 天），只有手動刪除（單刪/批刪）會移除；「用猜的」按鈕會把答對的題也 addWrong
- 依序刷題進度存 state.drillPos[cat|grades]，自創題庫 key 為 'custom'
- 內容擴充 roadmap（Tony 2026-08-02 定案，每日分批）：閱讀 54→102 篇（小學各8/國中各10/高中各8，優先）；成語 800→1000；字音 420→600；字形 400→600；俚語 320→400；成語 wordExp 逐字解析從小二往上補到全 800 條（小一已完成）；配圖目標全 800 條。動畫暫緩（成本高，Tony 同意先圖+逐字解析）
- 筆順動畫：js/vendor/hanzi-writer.min.js + strokes/uXXXX.json（來源 hanzi-writer-data，Arphic 授權見 strokes/README.md）；新增字形題後跑一次下載腳本補字（參考 git log f3972f1 的做法）；載不到的字自動隱藏面板

## 2026-08-18 各科雙題庫架構（Tony 定案，新科目一律照此）

國語以外的每一科都有**兩套題庫，不可混用**：
- `js/data/<科目>.js`（`APP_DATA.<科目>`，id `o0001`／`n0001` 這種）＝**依教育部課綱自編的原創題**，用在每日練習、單元學習、依序刷題（等同國語的成語/字音/字形那套）
- `js/data/<科目>-custom.js`（`APP_DATA.<科目>Custom`，id 前綴 `oc`/`nc`/`ec`/`mc`）＝家長提供的題本轉檔，只給首頁「自創題庫（依課練習）」用
- 前端對應：`CUSTOM_CATS` / `mainCat()` / `bankCat()` / `isBankCat()`（js/app.js）；各科紀錄分開（daily key 加 `|科目`、review 記 `subj`、units key 加科目前綴、錯題本依科目過濾）
- 原創題每題要寫「✅正解為什麼對＋❌其他選項為什麼不對＋📚課綱重點」，答案位置要打散（test.js 有守門）
- 題本轉檔規格與已完成範圍見 `PROGRESS.md`

## 2026-08-20 導覽與命名（Tony 五點回報後定案）

- **「自創題庫」對外一律叫「匯入題庫」**（家長匯入的題本），且**獨立在科目選擇頁最外層**跟科目並列：進去先選科目（`#customSubjs` 晶片列）→ 冊 → 課。科目內頁**不再有**「自創題庫／依課練習」卡，科目裡就只有依課綱自編的原創題（`importMode` / `importCat()` / `state.importSubj`）
- **科目選擇頁**分三組（`SUBJ_GROUPS`：共同科目／自然領域／社會領域），且只列目前勾選年級真的有題的科目，其餘收在「顯示全部科目」（`state.allSubj`）後面
- **科目卡的題數一律是「目前年級的題數」**（`subjCount(key, state.grades)`）。⛔ 不要顯示全庫題數——外面寫 432 題、進去卻依年級過濾成空白，就是 Tony 2026-08-20 回報的 bug。點到年級不符的科目要問要不要一鍵切年級（`askSwitchGrades`）
- **年級＝「學習範圍」**（2026-08-20 晚，Tony：「常常會忘記勾年級…右上角小小的並不明顯」）：
  `state.grade` 主要年級（單選，決定科目清單／單元目錄／課程進度）＋ `state.extra` 加練年級（多選），
  `state.grades` 仍是實際過濾用的陣列＝兩者聯集（`syncGrades()`，全站舊邏輯照用，不要繞過它直接改 grades）。
  入口是標題列下方常駐的 `#rangeBar`（測驗中隱藏，見 `RANGE_HIDDEN_VIEWS`），右上角小晶片保留。
  第一次進站走 `view-welcome` 問一次年級（`state.onboarded`）。舊資料在 `load()` 遷移：主要年級＝原本最高的那個，其餘轉加練，範圍不變
- **返回鍵**：`show()` 與 `history` 一一對應（`navStack`＋`popstate`），前進 pushState、退回走 `history.go`。加新頁只要照常呼叫 `show()` 就有返回鍵；中途離開要收尾的頁登記在 `NAV_CLEAN`

## 2026-08-03 全科版擴充（Tony 定案）

- 全科架構：進站先選科目（js/data/subjects.js 的 APP_SUBJECTS：國語/英文/數學/自然/社會），state.subject 記住；國語以外先有架構、題庫空著（schema 同 custom，id 前綴 e/m/n/o），有題後首頁自動出現「開始練習」
- 自創題庫分冊分課：custom 條目加選填 `book`（冊，如"五上"）、`lesson`（課，如"第1課"）；前端 view-custom 依 冊→課 選範圍刷題，進度 key 為 `custom|冊|課`（全庫沿用舊 key 'custom'）；沒標 book 歸「未分類」
- 測驗 UI 規則（2026-08-03 Tony 要求寫明）：
  - 「用猜的」按鈕：只在**第一次就答對**後顯示（答錯的題已自動加入錯題本，回饋文字會標明）；回顧舊題不顯示，回到最新已答對題會恢復顯示
  - 二次作答（2026-08-03）：第一次答錯不公布答案，提示「再想一次」讓學生自我修正，第二次作答後才顯示解析；成績/錯題本/統計一律以第一次為準；選項只剩 2 個的題不啟用（避免送分）
  - 「上一題」回顧：quiz.snaps 快照制，可往回翻已作答題目（唯讀，含作答結果與解析），「返回 →」走回最新題
  - 自創題庫可依 冊/課/難易度(diff)/題型(qtype) 篩選，刷題進度 key 含全部篩選條件；刷完一輪出現 🎉 完成提示
- 解析強化（範本：Tony 提供的鳶飛戾天筆記，指示詞見 docs/deep-exp-guide.md；2026-08-03 Tony 修訂：成語不要國字拆解）：
  - 成語題答題回饋自動列出其他 3 個選項的成語意思（讀 meaning）；字音題第 4 個借來的讀音自動標出處
  - 成語注音比較由前端自動生成（term+zhuyin 逐字），不用寫進資料
  - 選填欄位 `deep`：成語＝典故與成語意思（典故由來/字面意思/引申意思，出處不確定寧缺勿錯）；字音/字形＝兩段式（注音比較＋國字拆解與造字原因）；顯示於答題回饋與單元教學卡
  - deep 進度：2026-08-03 全數完成（成語 800/字音 420/字形 400 共 1620 條，test.js 有覆蓋率測試把關）；自創題庫等 Tony 交題後比照套用；新增題目時 deep 一併撰寫
