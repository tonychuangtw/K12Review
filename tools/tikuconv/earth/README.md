# 地球科學原創題庫的來源檔（一冊一個 jsonl）

一行一題 JSON，`id` 隨便給（`x1`、`t1_1`…），重建時由 `--renumber es` 統一編號。
檔案順序＝年級順序，改動某一冊不會影響其他冊的內容，但會讓其後所有題的 id 位移。

> 2026-08-23 補建此 README（2026-08-20 建置時沒留下重建指令）。
> ⛔ 加題一律開新的 `<冊>-addN.jsonl` 並接在下面指令的**最後面**，不要動既有 jsonl 的內容與順序。
> ⛔ 寫完 add 檔先跑 `python3 tools/tikuconv/check-add.py tools/tikuconv/earth <冊>.jsonl <add檔...>`。

| 檔案 | 冊 | 單元數 |
| --- | --- | --- |
| es10.jsonl / es10b.jsonl | 十上 / 十下 | 9 / 9 |
| es11.jsonl / es11b.jsonl | 十一上 / 十一下 | 9 / 9 |
| es12.jsonl / es12b.jsonl | 十二上 / 十二下 | 9 / 9 |
| es10-add1 / es10-add2 / es10-add3.jsonl | 十上加題（2026-08-23，補到每單元 24 題） | — |
| es10b-add1 / es10b-add2 / es10b-add3.jsonl | 十下加題（2026-08-23，補到每單元 24 題） | — |
| es11-add1 / es11-add2 / es11-add3.jsonl | 十一上加題（2026-08-23，補到每單元 24 題） | — |
| es11b-add1 / es11b-add2 / es11b-add3.jsonl | 十一下加題（2026-08-23，補到每單元 24 題） | — |
| es12-add1 / es12-add2 / es12-add3.jsonl | 十二上加題（2026-08-23，補到每單元 24 題） | — |

重建：

```bash
EF=tools/tikuconv/earth
node tools/tikuconv/build-bank.js earth js/data/earth.js $EF/header.txt --renumber es \
  $EF/es10.jsonl $EF/es10b.jsonl \
  $EF/es11.jsonl $EF/es11b.jsonl \
  $EF/es12.jsonl $EF/es12b.jsonl \
  $EF/es10-add1.jsonl \
  $EF/es10-add2.jsonl \
  $EF/es10-add3.jsonl \
  $EF/es10b-add1.jsonl \
  $EF/es10b-add2.jsonl \
  $EF/es10b-add3.jsonl \
  $EF/es11-add1.jsonl \
  $EF/es11-add2.jsonl \
  $EF/es11-add3.jsonl \
  $EF/es11b-add1.jsonl \
  $EF/es11b-add2.jsonl \
  $EF/es11b-add3.jsonl \
  $EF/es12-add1.jsonl \
  $EF/es12-add2.jsonl \
  $EF/es12-add3.jsonl
node test/test.js
```
