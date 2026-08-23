# 地理原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`q1_1`…），重建時由 `--renumber ge` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-23 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。
> ⛔ 寫完 add 檔先跑 `python3 tools/tikuconv/check-add.py tools/tikuconv/geography <冊>.jsonl <add檔...>`。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| ge10.jsonl / ge10b.jsonl | 十上 / 十下 | 9 / 9 |
| ge11.jsonl / ge11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| ge12.jsonl / ge12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| ge10-add1 / ge10-add2 / ge10-add3.jsonl | 十上加題（2026-08-23，補到每單元 24 題） | — |
| ge10b-add1 / ge10b-add2 / ge10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |
| ge11-add1 / ge11-add2 / ge11-add3.jsonl | 十一上加題（2026-08-23，補到每單元 24 題） | — |
| ge11b-add1 / ge11b-add2 / ge11b-add3.jsonl | 十一下加題（2026-08-23，補到每單元 24 題） | — |
| ge12-add1 / ge12-add2 / ge12-add3.jsonl | 十二上加題（2026-08-23，補到每單元 24 題） | — |

重建：

```bash
GF=tools/tikuconv/geography
node tools/tikuconv/build-bank.js geography js/data/geography.js $GF/header.txt --renumber ge \
  $GF/ge10.jsonl $GF/ge10b.jsonl \
  $GF/ge11.jsonl $GF/ge11b.jsonl \
  $GF/ge12.jsonl $GF/ge12b.jsonl \
  $GF/ge10-add1.jsonl \
  $GF/ge10-add2.jsonl \
  $GF/ge10-add3.jsonl \
  $GF/ge10b-add1.jsonl \
  $GF/ge10b-add2.jsonl \
  $GF/ge10b-add3.jsonl \
  $GF/ge11-add1.jsonl \
  $GF/ge11-add2.jsonl \
  $GF/ge11-add3.jsonl \
  $GF/ge11b-add1.jsonl \
  $GF/ge11b-add2.jsonl \
  $GF/ge11b-add3.jsonl \
  $GF/ge12-add1.jsonl \
  $GF/ge12-add2.jsonl \
  $GF/ge12-add3.jsonl
node test/test.js
```
