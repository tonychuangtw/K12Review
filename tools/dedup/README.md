# 清除題庫重複題的工具

2026-08-26 Tony 的兒子在四上自然發現題目重複，全站掃描後確認原創題庫有 437 題
「同一冊題幹重複」。這裡是處理那批題目的工具，之後若再發現重複也照這個流程走。

## 為什麼會發生（兩個守門都失效了）

1. `test/test.js` 的重複守門拿「題幹＋選項＋答案」當 key，但 `build-bank.js`
   會刻意輪轉答案位置（`r.answer = i % 4`）並重排選項 —— 同一題加兩次，兩份 key
   必然不同，等於這道關卡從來沒有作用過。**已改成以「冊」為範圍比對正規化後的題幹。**
2. `check-add.py` 的完全重複比對用原字串，兩題只差一個標點就只被判成「近似」，
   而出貨腳本只擋「題目重複」不擋「題目近似」。**已改成先正規化再比對。**

## 流程

```bash
# 1. 全站掃描（看還剩多少）
node tools/dedup/scan.js

# 2. 挑一冊，列出待修的重複題 ＋ 那些單元既有的題幹（新題不可撞到）
node tools/dedup/work.js science 五下

# 3. 逐題手寫替換題（⛔ 不可交 subagent，見 CLAUDE.md），寫成 replace.apply 的參數：
python3 - <<'PY'
import sys; sys.path.insert(0, 'tools/dedup')
import replace
replace.apply('tools/tikuconv/science', {'n5b-add4.jsonl': {12: dict(
    q='...', options=['正解','誘答1','誘答2','誘答3'],
    exp='✅ 正解：...\n❌ 其他選項：...\n📚 課綱重點：...',
    tag='...', diff='中', qtype='常識')}})
PY

# 4. 重建該科題庫（指令從該科 README 的 code block 抽出來，不用手抄）
tools/dedup/rebuild.sh science

# 5. 驗收
node test/test.js        # 該科「同一冊無重複題幹」要是 0
node test/zy-check.js
```

## 規則

- **保留先出現的那一題，換掉後出現的**：早期的 id 較小，學生的錯題本可能已經引用。
- **一題換一題，不可只刪不補**：每冊必須維持 288 題（9 單元 × 32 題）。
- 替換題要留在**同一個單元**，並符合原本的解析格式（✅ 正解／❌ 其他選項／📚 課綱重點）。
- `replace.py` 會自動檢查：4 個相異選項、解析三段齊全、沒有混進西里爾字母／假名／諺文，
  並把 `answer` 設回 0（實際位置由 build-bank 輪轉）。
- 匯入題庫（Tony 提供的題本轉檔）的重複來自原始題本，**不要動**。
