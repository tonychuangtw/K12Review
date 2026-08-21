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

## 4. 模型等級分工（Tony 2026-08-21 決策背景）

| 工作 | 建議模型 |
| --- | --- |
| 照流程 A/C 加題、轉檔、跑建置測試 | 低階（Sonnet 級）即可——有 build-bank + test.js 雙重守門 |
| 國語科新增（成語典故考證、字音審訂音、deep 解析） | 高階——寧缺勿錯的考證工作 |
| 前端改動（app.js／新科目上架／UI）、除錯、架構調整 | 高階 |
| 內容出錯的善後（id 位移、進度資料修復） | 高階 |

低階模型遇到本文件沒涵蓋的狀況（測試紅燈修不掉、發現規格衝突、
題目答案拿不準）：**停下來，把現況寫進 PROGRESS.md 並回報 Tony**，不要即興處理。
