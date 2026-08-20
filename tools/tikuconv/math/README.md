# 數學原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`x2`…），重建時由 `--renumber m` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| m1.jsonl / m1b.jsonl | 一上 / 一下 | 9 / 9 |
| m2.jsonl / m2b.jsonl | 二上 / 二下 | 9 / 9 |
| m3.jsonl / m3b.jsonl | 三上 / 三下 | 9 / 9 |
| m4.jsonl / m4b.jsonl | 四上 / 四下 | 9 / 9 |
| m5.jsonl | 五上 | 9（由原 7 單元 126 題重新歸單元而來） |
| m5b.jsonl | 五下 | 9 |
| m6.jsonl / m6b.jsonl | 六上 / 六下 | 9 / 9 |
| m7…m12b.jsonl | 七上～十二下 | 各 9 |
| m5-add1 / m5-add2.jsonl | 五上加題（2026-08-20，補到每單元 24 題） | — |
| m5b-add1 / m5b-add2.jsonl | 五下加題（2026-08-21，補到每單元 24 題） | — |
| m6-add1 / m6-add2.jsonl | 六上加題（2026-08-21，補到每單元 24 題） | — |

重建：

```bash
node tools/tikuconv/build-bank.js math js/data/math.js tools/tikuconv/math/header.txt --renumber m \
  tools/tikuconv/math/m1.jsonl  tools/tikuconv/math/m1b.jsonl \
  tools/tikuconv/math/m2.jsonl  tools/tikuconv/math/m2b.jsonl \
  tools/tikuconv/math/m3.jsonl  tools/tikuconv/math/m3b.jsonl \
  tools/tikuconv/math/m4.jsonl  tools/tikuconv/math/m4b.jsonl \
  tools/tikuconv/math/m5.jsonl  tools/tikuconv/math/m5b.jsonl tools/tikuconv/math/m6.jsonl
node test/test.js
```

build-bank.js 會順便報：每冊的題數與單元數（不足 9 單元會標 ⚠）、答案位置分布、
id 重複、完全重複題。撰寫規格見 `PROGRESS.md`（一冊 9 單元 = 3 段考 × 3 單元）。
