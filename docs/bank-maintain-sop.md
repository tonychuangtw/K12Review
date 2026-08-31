# 題庫維護 SOP（灌新題庫／加題／匯入題庫）

> 2026-08-21 建立。目的：之後灌題庫的例行工作交給**低階模型**照本文件執行即可，
> 不需要高階模型。照步驟做、每一步的驗證都跑，做不到或測試不過就停下來回報，不要自行發明流程。

## 0. 兩套題庫，永遠分開，互不影響

| | 原創題庫 | 匯入題庫（前端顯示「匯入題庫」，程式內叫 custom／自創） |
| --- | --- | --- |
| 檔案 | `js/data/<科>.js` | `js/data/<科>-custom.js` |
| APP_DATA key | `math`、`english`… | `mathCustom`、`englishCustom`… |
| id 前綴 | `m0001`、`e0001`、`n`、`o`… | `mc`、`ec`、`nc`、`oc`… |
| 內容來源 | 依教育部課綱**逐題自編** | 家長提供的出版社題本**轉檔**（原檔有版權，不進 repo） |
| 前端入口 | 每日練習／單元學習／依序刷題 | 首頁「匯入題庫（依課練習）」（`importCat()`） |
| 進度 key | `cat|grades`、units `gX-uY` 等 | `custom|冊|課` |
| 建置工具 | `tools/tikuconv/build-bank.js` | 各科轉檔管線 + `emit.py`（見 `tools/tikuconv/README.md`） |

**因為檔案、id 命名空間、進度 key 全部分開，擴充其中一套不會動到另一套。**
唯二共用的是前端過濾邏輯（`js/app.js` 的 `CUSTOM_CATS`/`bankCat()` 等，加題不會碰到）
和 `test/test.js`（兩套都會檢查，這是好事）。

## 0.5 ⚠ 直接改 js/data 的工具，改完一定要同步回 jsonl（2026-09-05 血淚）

`js/data/<科>.js` 是 `build-bank.js` 從 `tools/tikuconv/<科>/*.jsonl` **產生**出來的。
但「逐題人工重寫」那一類工具（`set-qfix.js`、`set-distractors.js`）為了方便是**直接改 js/data**。
兩邊一旦分岔，下次照流程 A 加題重建，人工重寫的成果就會被 jsonl 的舊內容**靜默洗掉**。

2026-09-05 高中七科 10,951 題誘答重寫完，就是差一步全部沒了（當時 physics 有 1,147 題只存在於 js/data）。

**規則：任何直接改 js/data 的批次收工後，跑一次同步再 commit。**

```bash
python3 tools/sync-bank-to-jsonl.py <科目>            # 先看不改，報幾題不同
python3 tools/sync-bank-to-jsonl.py <科目> --write    # 寫回 jsonl
```

它照 README 重建指令的檔案順序把「第 N 題對第 N 題」，逐題核對 `q` 全對得上才寫回
`options`／`answer`／`exp`；對不上會直接停下來不寫（順序走鐘時不要硬幹）。
驗收：重跑一次 README 的重建指令，`js/data/<科>.js` 應該**一個字都不變**。

## 1. 流程 A：原創題庫加題（最常見的例行工作）

一次做一冊（例：數學三上）。**一冊 = 一個 commit**。

### 步驟

1. **讀單元名與既有題目**（避免撞題、避免單元名打錯）：
   ```bash
   python3 - <<'EOF'
   import json
   from collections import OrderedDict
   lines=[json.loads(l) for l in open('tools/tikuconv/math/m3.jsonl') if l.strip()]
   units=OrderedDict()
   for d in lines: units.setdefault(d['lesson'],[]).append(d['q'][:40])
   for u,qs in units.items():
       print(u, len(qs))
       for q in qs: print('  ', q)
   EOF
   ```
   ⚠️ 之後寫的每一題，`lesson` 欄位必須與這裡印出的單元名**一字不差**（含全形冒號、空格）。

2. **逐題手寫**新檔 `tools/tikuconv/<科>/<冊>-addN.jsonl`（一行一題 JSON）。
   慣例：一冊補 3 檔各 48 題（每單元 16 題），add1=第 1–3 單元、add2=4–6、add3=7–9。
   欄位 schema（與同目錄既有 jsonl 完全相同，**不多不少**）：
   ```json
   {"id":"y1","grade":3,"book":"三上","lesson":"第1單元 ○○○","tag":"…","diff":"易|中|難","qtype":"…","q":"…","options":["…","…","…","…"],"answer":0,"exp":"✅ 正解：…\n❌ 其他選項：…\n📚 課綱重點：…","src":"課綱自編"}
   ```
   - `id` 檔內隨便編（y1、z1、w1…），重建時 `--renumber` 會統一改掉
   - `qtype` 照該科慣例：數學＝數與量/計算/應用/幾何/概念；自然社會＝選擇題；
     英文＝字彙/文法/對話/閱讀/寫作/聽力/口說/應試
   - `exp` 三段缺一不可；繁體台灣用字；選項恰 4 個且不重複
   - 正解放哪個位置**不用刻意平均**——build-bank 會自動旋轉成 25/25/25/25。
     但解析與選項**不要寫位置指涉**（「第一個選項」「最後一句」），有位置指涉的題不會被旋轉
   - 爛誘答禁用：「都不對」「以上皆非」「這裡沒有」這類湊數選項，build 會警告

3. **自我檢查**（寫完每個檔跑一次）：
   ```bash
   python3 -c "
   import json
   for l in open('tools/tikuconv/math/m3-add1.jsonl'):
       d=json.loads(l)
       assert set(d)=={'id','grade','book','lesson','tag','diff','qtype','q','options','answer','exp','src'}, d['id']
       assert len(set(d['options']))==4, d['id']
   print('ok')"
   ```
   另外 grep 一下有沒有中英夾雜的怪選項（歷史教訓：「stayed（過去式）」「都不對」這種）：
   `grep -oP '"[^"]*[一-鿿]+[a-zA-Z]+[^"]*"' <檔案> | head`，人工判斷是否正常。

4. **更新該科 `tools/tikuconv/<科>/README.md`**：
   - 檔案表加一列（照既有格式）
   - 重建指令**最尾巴**追加新的 add 檔（`\` 換行接續）
   ⛔ **add 檔一定放指令最後面**：`--renumber` 照檔案順序編號，插在中間會讓後面所有題的
   id 位移，使用者錯題本／單元進度就對到別題。同理**不准動既有 jsonl 的內容與順序**。

5. **重建**——一律執行 README 裡的指令本體，不要憑記憶重打（歷史教訓：手打漏檔會靜默失敗）：
   ```bash
   export MF=tools/tikuconv/math   # 英文用 EF=tools/tikuconv/english，變數名看 README 開頭
   awk '/^node tools\/tikuconv\/build-bank.js/,/^node test\/test.js/' tools/tikuconv/math/README.md | head -n -1 | bash
   ```
   **必須親眼看到這三行才算建置成功**（沒看到＝失敗，不准 commit）：
   - `math NNNN 題 → js/data/math.js`（總題數有增加）
   - 目標冊顯示 `216 題 / 9 單元`
   - `答案位置分布 … 最大占比 25.0%`，且沒有 `⚠ 爛誘答`／`⚠ 完全重複題`

6. **跑測試**：`node test/test.js` → 必須「全部通過」。

7. **commit + push**（一冊一個 commit，訊息照慣例）：
   ```
   數學三上加題至每單元24題(216題/9單元);數學全科NNNN題
   ```
   commit 前 `git status` 確認 `js/data/<科>.js` 真的在變更清單裡（防步驟 5 靜默失敗）。

8. **更新 `PROGRESS.md`** 進度表與 UPDATED（台北時間 = UTC+8，用 `TZ=Asia/Taipei date`）。

### 硬規則（違反任何一條就是重大事故）

- ⛔ **不可交 subagent／平行代理量產題目**（2026-08-02 四個 agent 全交假貨）。低階模型自己逐題寫沒問題，外包出去不行。
- ⛔ add 檔放建置指令最後面；不改既有 jsonl。
- ⛔ 建置輸出沒看到「N 題 → js/data/…」就不准 commit。
- ⛔ 答案不確定的題寧可不出，不可用猜的。

## 2. 流程 B：全新科目／全新一冊

1. 開 `tools/tikuconv/<科>/` 放 `header.txt`（照別科抄，改 APP_DATA key 與註解）與各冊 jsonl
2. 單元切法照 Tony 2026-08-20 規格：**一冊 9 單元**（3 段考 × 3 單元），單元名自訂但要像課綱
3. README.md 照別科格式寫檔案表 + 完整重建指令
4. `js/data/subjects.js`、`js/app.js`（科目分組 `SUBJ_GROUPS`）、`index.html` 的 script 標籤可能要加——這部分**動到前端，交給高階模型**
5. 之後照流程 A

## 3. 流程 C：匯入題庫（custom）轉檔

家長傳新題本（Word/docx）時才會做。詳細管線在 `tools/tikuconv/README.md`
與專案 `CLAUDE.md` 的「自創題庫轉檔規格」，重點：

1. 文字抽取（`doc-extract.py` 或各科 `parse.py`）→ `items.json`
2. 機械可轉的（四選一、是非）用腳本轉；填空／配合／回答問題**逐題人工改寫**誘答與解析
3. `emit.py` 產出 `js/data/<科>-custom.js`。**新批次同樣接在 emit 參數清單最後面**
   （custom 進度 key 是 `custom|冊|課`，id 順序一樣不能位移）
4. `book`（如"五上"）、`lesson`（如"第3課"）要標，沒標會歸「未分類」
5. 一樣跑 `node test/test.js` 後才 commit；題本原檔與 `items.json` **不進 repo**（版權）

**對原創題庫的影響：零。** 反過來原創加題也完全不影響 custom。
兩邊唯一要各自小心的是同一件事：**自己那套的 id 順序不能位移**。

## 3.5 流程 D：概念卡（單元學習的「教材層」）

2026-08-21 起，單元學習不再只是「題目劇透 → 測驗」。有概念卡的單元走：
**概念卡（說明＋互動元件＋立即檢核）→ 單元測驗**；沒寫概念卡的單元自動走舊流程，兩者可並存。

- 資料檔：`js/data/lessons-<科>.js`，key = `<科目>|<冊>|<單元名>`
  （單元名要與 `js/data/<科>.js` 的 `lesson` 欄位**一字不差**，否則對不上就不會出現）
- 一張卡的欄位：
  ```js
  { title: '① 標題', body: '教學文字，用 \n 分段',
    viz: { type: 'fracbar', parts: 4, shade: 1, editParts: [2, 10] },   // 互動元件，可省略
    tip: '操作提示（可省略）',
    check: { q: '換你試試的問題', options: [4 個], answer: 索引,
             why: ['選到第0個要說的話', null, '…', '…'] } }             // 正解那格放 null
  ```
- 目前可用的 `viz.type` 有 **81 種**（定義在 `js/widgets.js`，每個元件上方的註解寫了它的 spec 欄位）。
  ⛔ 不要憑記憶猜型別名稱：**開 `tools/widget-preview.html`**（`python3 -m http.server` 後瀏覽）
  就能看到每一種元件長什麼樣、spec 怎麼寫，挑好再抄。
  概略分類：分數與數（fracbar/fraccircle/fraccompare/placevalue/tenframe/numbond/counters/decimalgrid）、
  計算（column/array/grouping/exprsteps/rounding/factors/primefac/algetile/crossmult/areamodel）、
  幾何（angle/protractor/lines/triangle/quad/polygon/areagrid/areaformula/cuboid/netbox/symmetry/
  circleparts/circlearea/cylinder/solid/pythagoras/triangleangles/cutangles/congruent/quaddiag/
  tricenters/circleangles/circleline/similar/coordplane/linegraph/parabola/conic/space3d/lintrans）、
  數列與極限（seq/limit）、統計機率（bargraph/linechart/piechart/dotplot/boxplot/spread/probtable/
  normaldist/scatter/condprob/counting）、高中專用（logexp/trig/triglaw/unitcircle/trigwave/
  vector/matrix/linprog/complexplane/deriv/curveplot/integralarea）、其他（clock/numberline/
  compare/intchips/balance/ratiobar/ineqline/proportion）。
  **新元件要寫程式 → 交高階模型**；用既有元件寫概念卡 → 低階模型可做。
- **換科目時**（例如開始寫自然科的 `js/data/lessons-science.js`）還要做三件事，
  只寫資料檔不會生效：① `index.html` 加 script 標籤 ② `test/test.js` 頂端的
  `for (const f of ['lessons-math'])` 陣列加進去 ③ 跑 `python3 tools/stamp-version.py`。

### 寫概念卡的硬規則

- ⛔ **不可以把題目的解析搬過來當教材**。概念卡的讀者是「完全沒學過的人」：
  要從生活情境開場（披薩、繩子、蛋糕），先給直覺再給定義，不要一上來就寫數學術語。
- ⛔ `check` 的 `why` **每一個誘答都要寫**，而且要針對「他為什麼會這樣想」，
  不是重講一次正解。例：「這是最常見的誤會！分母是分成幾份，分越多份每份就越小」。
  這是整個設計最值錢的部分——誤答分支寫得好，等於一對一補救教學。
- ⛔ 一張卡只講一個概念；一個單元 5～8 張。超過 8 張學生會累。
- 迷思優先：先想「這個單元學生最常錯在哪」，把那個迷思做成單獨一張卡（例：1/8 > 1/4）。

### 驗收

1. `node test/test.js` 全綠（概念卡不影響題庫測試，但別把資料檔寫壞）
2. `node test/browser-smoke.mjs` 的「概念卡（單元教學層）」段全過（**全套約 5 分鐘，不要用 120 秒 timeout 砍它**）
3. 手動看一次：單元列表該單元有「教材」徽章、點進去是概念卡不是題目
4. ⚠️ **動到 js/ 或 css/ 就要 `python3 tools/stamp-version.py` 再 commit**——
   不換 `?v=` 版本戳，使用者手機會拿到快取的舊檔，看起來就像「改了沒效果」

## 4. 模型等級分工（Tony 2026-08-21 決策背景）

| 工作 | 建議模型 |
| --- | --- |
| 照流程 A/C 加題、轉檔、跑建置測試 | 低階（Sonnet 級）即可——有 build-bank + test.js 雙重守門 |
| 用**既有**互動元件寫概念卡（流程 D） | 低階即可，但誤答分支要寫得具體，寫完自己走一次流程 |
| 新增互動元件（js/widgets.js 寫新 type） | 高階——這是寫程式，且要顧四種主題與觸控 |
| 國語科新增（成語典故考證、字音審訂音、deep 解析） | 高階——寧缺勿錯的考證工作 |
| 前端改動（app.js／新科目上架／UI）、除錯、架構調整 | 高階 |
| 內容出錯的善後（id 位移、進度資料修復） | 高階 |

低階模型遇到本文件沒涵蓋的狀況（測試紅燈修不掉、發現規格衝突、
題目答案拿不準）：**停下來，把現況寫進 PROGRESS.md 並回報 Tony**，不要即興處理。
