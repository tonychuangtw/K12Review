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
| m6b-add1 / m6b-add2.jsonl | 六下加題（2026-08-21，補到每單元 24 題） | — |
| m3-add1 / m3-add2 / m3-add3.jsonl | 三上加題（2026-08-21，補到每單元 24 題） | — |
| m3b-add1 / m3b-add2 / m3b-add3.jsonl | 三下加題（2026-08-21，補到每單元 24 題） | — |
| m2-add1 / m2-add2 / m2-add3.jsonl | 二上加題（2026-08-21，補到每單元 24 題） | — |
| m2b-add1 / m2b-add2 / m2b-add3.jsonl | 二下加題（2026-08-21，補到每單元 24 題） | — |
| m1-add1 / m1-add2 / m1-add3.jsonl | 一上加題（2026-08-21，補到每單元 24 題） | — |
| m1b-add1 / m1b-add2 / m1b-add3.jsonl | 一下加題（2026-08-21，補到每單元 24 題） | — |
| m10-add1 / m10-add2 / m10-add3.jsonl | 十上加題（2026-08-21，補到每單元 24 題） | — |
| m10b-add1 / m10b-add2 / m10b-add3.jsonl | 十下加題（2026-08-21，補到每單元 24 題） | — |
| m11-add1 / m11-add2 / m11-add3.jsonl | 十一上加題（2026-08-21，補到每單元 24 題） | — |
| m11b-add1 / m11b-add2 / m11b-add3.jsonl | 十一下加題（2026-08-21，補到每單元 24 題） | — |
| m12-add1 / m12-add2 / m12-add3.jsonl | 十二上加題（2026-08-21，補到每單元 24 題） | — |
| m12b-add1 / m12b-add2 / m12b-add3.jsonl | 十二下加題（2026-08-21，補到每單元 24 題） | — |
| m7-add3.jsonl | 七上加題（2026-08-25，補到每單元 32 題） | — |
| m7b-add3.jsonl | 七下加題（2026-08-25，補到每單元 32 題） | — |
| m8-add3.jsonl | 八上加題（2026-08-26，補到每單元 32 題） | — |
| m8b-add3.jsonl | 八下加題（2026-08-26，補到每單元 32 題） | — |
| m9-add3.jsonl | 九上加題（2026-08-26，補到每單元 32 題） | — |
| m9b-add3.jsonl | 九下加題（2026-08-26，補到每單元 32 題） | — |

重建：

```bash
MF=tools/tikuconv/math
node tools/tikuconv/build-bank.js math js/data/math.js $MF/header.txt --renumber m \
  $MF/m1.jsonl $MF/m1b.jsonl \
  $MF/m2.jsonl $MF/m2b.jsonl \
  $MF/m3.jsonl $MF/m3b.jsonl \
  $MF/m4.jsonl $MF/m4b.jsonl \
  $MF/m5.jsonl $MF/m5b.jsonl \
  $MF/m6.jsonl $MF/m6b.jsonl \
  $MF/m7.jsonl $MF/m7b.jsonl \
  $MF/m8.jsonl $MF/m8b.jsonl \
  $MF/m9.jsonl $MF/m9b.jsonl \
  $MF/m10.jsonl $MF/m10b.jsonl \
  $MF/m11.jsonl $MF/m11b.jsonl \
  $MF/m12.jsonl $MF/m12b.jsonl \
  $MF/m5-add1.jsonl \
  $MF/m5-add2.jsonl \
  $MF/m5b-add1.jsonl \
  $MF/m5b-add2.jsonl \
  $MF/m6-add1.jsonl \
  $MF/m6-add2.jsonl \
  $MF/m6b-add1.jsonl \
  $MF/m6b-add2.jsonl \
  $MF/m7-add1.jsonl \
  $MF/m7-add2.jsonl \
  $MF/m7b-add1.jsonl \
  $MF/m7b-add2.jsonl \
  $MF/m8-add1.jsonl \
  $MF/m8-add2.jsonl \
  $MF/m8b-add1.jsonl \
  $MF/m8b-add2.jsonl \
  $MF/m9-add1.jsonl \
  $MF/m9-add2.jsonl \
  $MF/m9b-add1.jsonl \
  $MF/m9b-add2.jsonl \
  $MF/m4-add1.jsonl \
  $MF/m4-add2.jsonl \
  $MF/m4b-add1.jsonl \
  $MF/m4b-add2.jsonl \
  $MF/m3-add1.jsonl \
  $MF/m3-add2.jsonl \
  $MF/m3-add3.jsonl \
  $MF/m3b-add1.jsonl \
  $MF/m3b-add2.jsonl \
  $MF/m3b-add3.jsonl \
  $MF/m2-add1.jsonl \
  $MF/m2-add2.jsonl \
  $MF/m2-add3.jsonl \
  $MF/m2b-add1.jsonl \
  $MF/m2b-add2.jsonl \
  $MF/m2b-add3.jsonl \
  $MF/m1-add1.jsonl \
  $MF/m1-add2.jsonl \
  $MF/m1-add3.jsonl \
  $MF/m1b-add1.jsonl \
  $MF/m1b-add2.jsonl \
  $MF/m1b-add3.jsonl \
  $MF/m10-add1.jsonl \
  $MF/m10-add2.jsonl \
  $MF/m10-add3.jsonl \
  $MF/m10b-add1.jsonl \
  $MF/m10b-add2.jsonl \
  $MF/m10b-add3.jsonl \
  $MF/m11-add1.jsonl \
  $MF/m11-add2.jsonl \
  $MF/m11-add3.jsonl \
  $MF/m11b-add1.jsonl \
  $MF/m11b-add2.jsonl \
  $MF/m11b-add3.jsonl \
  $MF/m12-add1.jsonl \
  $MF/m12-add2.jsonl \
  $MF/m12-add3.jsonl \
  $MF/m12b-add1.jsonl \
  $MF/m12b-add2.jsonl \
  $MF/m12b-add3.jsonl \
  $MF/m7-add3.jsonl \
  $MF/m7b-add3.jsonl \
  $MF/m8-add3.jsonl \
  $MF/m8b-add3.jsonl \
  $MF/m9-add3.jsonl \
  $MF/m9b-add3.jsonl
node test/test.js
```

⛔ 24 冊一個都不能漏（漏掉的冊會整批消失）。重建後先看 build-bank 印出的分冊統計
（應為 24 冊、目前 3456 題），再 `git diff --stat` 確認只有新增沒有大量刪除，然後才 commit。

build-bank.js 會順便報：每冊的題數與單元數（不足 9 單元會標 ⚠）、答案位置分布、
id 重複、完全重複題。撰寫規格見 `PROGRESS.md`（一冊 9 單元 = 3 段考 × 3 單元）。
