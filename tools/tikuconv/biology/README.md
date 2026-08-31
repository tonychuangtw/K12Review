# 生物原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`m1_1`…），重建時由 `--renumber bi` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-23 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。
> ⛔ 寫完 add 檔先跑 `python3 tools/tikuconv/check-add.py tools/tikuconv/biology <冊>.jsonl <add檔...>`。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| bi10.jsonl / bi10b.jsonl | 十上 / 十下 | 9 / 9 |
| bi11.jsonl / bi11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| bi12.jsonl / bi12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| bi10-add1 / bi10-add2 / bi10-add3.jsonl | 十上加題（2026-08-23，補到每單元 24 題） | — |
| bi10b-add1 / bi10b-add2 / bi10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |
| bi11-add1 / bi11-add2 / bi11-add3.jsonl | 十一上加題（2026-08-23，補到每單元 24 題） | — |
| bi11b-add1 / bi11b-add2 / bi11b-add3.jsonl | 十一下加題（2026-08-23，補到每單元 24 題） | — |
| bi12-add1 / bi12-add2 / bi12-add3.jsonl | 十二上加題（2026-08-23，補到每單元 24 題） | — |
| bi12b-add1 / bi12b-add2 / bi12b-add3.jsonl | 十二下加題（2026-08-23，補到每單元 24 題） | — |
| bi10-add4.jsonl | 生物十上加題（2026-08-26，補到每單元 32 題） | — |
| bi10b-add4.jsonl | 生物十下加題（2026-08-26，補到每單元 32 題） | — |
| bi11-add4.jsonl | 生物十一上加題（2026-08-26，補到每單元 32 題） | — |
| bi11b-add4.jsonl | 生物十一下加題（2026-08-26，補到每單元 32 題） | — |
| bi12-add4.jsonl | 生物十二上加題（2026-08-26，補到每單元 32 題） | — |
| bi12b-add4.jsonl | 生物十二下加題（2026-08-26，補到每單元 32 題） | — |
| bi10-add5.jsonl | 十上加題（2026-09-05，補「易」難度入門題與實驗／圖表／計算題，每單元 8 題→40 題） | — |
| bi10b-add5.jsonl | 十下加題（2026-09-05，同上） | — |
| bi11-add5.jsonl | 十一上加題（2026-09-05，同上） | — |

重建：

```bash
BF=tools/tikuconv/biology
node tools/tikuconv/build-bank.js biology js/data/biology.js $BF/header.txt --renumber bi \
  $BF/bi10.jsonl $BF/bi10b.jsonl \
  $BF/bi11.jsonl $BF/bi11b.jsonl \
  $BF/bi12.jsonl $BF/bi12b.jsonl \
  $BF/bi10-add1.jsonl \
  $BF/bi10-add2.jsonl \
  $BF/bi10-add3.jsonl \
  $BF/bi10b-add1.jsonl \
  $BF/bi10b-add2.jsonl \
  $BF/bi10b-add3.jsonl \
  $BF/bi11-add1.jsonl \
  $BF/bi11-add2.jsonl \
  $BF/bi11-add3.jsonl \
  $BF/bi11b-add1.jsonl \
  $BF/bi11b-add2.jsonl \
  $BF/bi11b-add3.jsonl \
  $BF/bi12-add1.jsonl \
  $BF/bi12-add2.jsonl \
  $BF/bi12-add3.jsonl \
  $BF/bi12b-add1.jsonl \
  $BF/bi12b-add2.jsonl \
  $BF/bi12b-add3.jsonl \
  $BF/bi10-add4.jsonl \
  $BF/bi10b-add4.jsonl \
  $BF/bi11-add4.jsonl \
  $BF/bi11b-add4.jsonl \
  $BF/bi12-add4.jsonl \
  $BF/bi12b-add4.jsonl \
  $BF/bi10-add5.jsonl \
  $BF/bi10b-add5.jsonl \
  $BF/bi11-add5.jsonl
node test/test.js
```
