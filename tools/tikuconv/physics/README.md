# 物理原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`y1`…），重建時由 `--renumber ph` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-23 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| ph10.jsonl / ph10b.jsonl | 十上 / 十下 | 9 / 9 |
| ph11.jsonl / ph11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| ph12.jsonl / ph12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| ph10-add1 / ph10-add2 / ph10-add3.jsonl | 十上加題（2026-08-23，補到每單元 24 題） | — |
| ph10-add4.jsonl | 十上加題（2026-08-26，補到每單元 32 題） | — |
| ph10b-add4.jsonl | 十下加題（2026-08-26，補到每單元 32 題） | — |
| ph11-add4.jsonl | 十一上加題（2026-08-26，補到每單元 32 題） | — |
| ph10b-add1 / ph10b-add2 / ph10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |
| ph11-add1 / ph11-add2 / ph11-add3.jsonl | 十一上加題（2026-08-23，補到每單元 24 題） | — |
| ph11b-add1 / ph11b-add2 / ph11b-add3.jsonl | 十一下加題（2026-08-23，補到每單元 24 題） | — |
| ph12-add1 / ph12-add2 / ph12-add3.jsonl | 十二上加題（2026-08-23，補到每單元 24 題） | — |
| ph12b-add1 / ph12b-add2 / ph12b-add3.jsonl | 十二下加題（2026-08-23，補到每單元 24 題） | — |

重建：

```bash
PF=tools/tikuconv/physics
node tools/tikuconv/build-bank.js physics js/data/physics.js $PF/header.txt --renumber ph \
  $PF/ph10.jsonl $PF/ph10b.jsonl \
  $PF/ph11.jsonl $PF/ph11b.jsonl \
  $PF/ph12.jsonl $PF/ph12b.jsonl \
  $PF/ph10-add1.jsonl \
  $PF/ph10-add2.jsonl \
  $PF/ph10-add3.jsonl \
  $PF/ph10b-add1.jsonl \
  $PF/ph10b-add2.jsonl \
  $PF/ph10b-add3.jsonl \
  $PF/ph11-add1.jsonl \
  $PF/ph11-add2.jsonl \
  $PF/ph11-add3.jsonl \
  $PF/ph11b-add1.jsonl \
  $PF/ph11b-add2.jsonl \
  $PF/ph11b-add3.jsonl \
  $PF/ph12-add1.jsonl \
  $PF/ph12-add2.jsonl \
  $PF/ph12-add3.jsonl \
  $PF/ph12b-add1.jsonl \
  $PF/ph12b-add2.jsonl \
  $PF/ph12b-add3.jsonl \
  $PF/ph10-add4.jsonl \
  $PF/ph10b-add4.jsonl \
  $PF/ph11-add4.jsonl
node test/test.js
```
